import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { OrderDto } from '@caffeapp/shared';
import { calculateOrderTotal, isValidProductUnitPrice } from '@caffeapp/shared';
import {
  BranchAssignmentStatus,
  OrderStatus,
  OrderType,
  StaffRole,
  TableStatus,
  NotificationType,
  ShiftStatus,
} from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { AuditService } from '@common/audit/audit.service';
import { ActorResolverService } from '@common/audit/actor-resolver.service';
import { assertBranchAccess, resolveBranchScope } from '@common/utils/branch-scope.util';
import { syncTableEmptyIfIdle } from '@common/utils/table-status.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { OrdersGateway } from './orders.gateway';
import { STATUS_TRANSITIONS } from './orders.constants';
import type { DeliveryStateFilter } from './orders.types';
import { toOrderDto } from './order.mapper';
import { assertStatusRole, nextOrderNumber } from './order-policy.util';
import type { CancelOrderDto } from './dto/cancel-order.dto';
import type { CreateOrderDto as CreateOrderBodyDto } from './dto/create-order.dto';
import type { DeliverOrderDto } from './dto/deliver-order.dto';
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { ToggleItemPreparedDto } from './dto/toggle-item-prepared.dto';

export type { DeliveryStateFilter } from './orders.types';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
    private readonly actorResolver: ActorResolverService,
    private readonly gateway: OrdersGateway,
  ) {}

  async listForBranch(
    payload: JwtPayload,
    branchId?: string,
    statusFilter?: string,
    tableId?: string,
    deliveryState?: DeliveryStateFilter,
  ): Promise<OrderDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    let statuses: OrderStatus[] | undefined;
    if (payload.role === StaffRole.BARISTA) {
      statuses = [OrderStatus.PENDING, OrderStatus.MAKING, OrderStatus.READY];
    } else if (statusFilter) {
      statuses = statusFilter.split(',').filter(Boolean) as OrderStatus[];
    }

    const orders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        ...(tableId ? { tableId } : {}),
        ...(statuses?.length ? { status: { in: statuses } } : {}),
        ...(deliveryState === 'awaiting_delivery'
          ? { status: OrderStatus.READY, deliveredAt: null }
          : {}),
        ...(deliveryState === 'awaiting_payment'
          ? { status: OrderStatus.READY, deliveredAt: { not: null } }
          : {}),
      },
      include: { items: true },
      orderBy: {
        createdAt: payload.role === StaffRole.BARISTA ? 'asc' : 'desc',
      },
      take: 100,
    });

    return orders.map((o) => toOrderDto(o));
  }

  async create(payload: JwtPayload, dto: CreateOrderBodyDto): Promise<OrderDto> {
    const branchId = resolveBranchScope(payload, dto.branchId);
    assertBranchAccess(payload, branchId);

    if (dto.orderType === OrderType.DINE_IN && !dto.tableId) {
      throw new BadRequestException('Đơn tại bàn cần chọn bàn');
    }
    if (dto.orderType === OrderType.TAKE_AWAY && dto.tableId) {
      throw new BadRequestException('Đơn mang đi không gắn bàn');
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, branchId, isAvailable: true },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('Có món không hợp lệ hoặc không còn bán');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    if (dto.tableId) {
      const table = await this.prisma.table.findFirst({
        where: { id: dto.tableId, branchId },
      });
      if (!table) {
        throw new BadRequestException('Bàn không tồn tại');
      }
      if (table.status === TableStatus.MAINTENANCE) {
        throw new BadRequestException('Bàn đang bảo trì');
      }
    }

    const lineItems = dto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      if (!isValidProductUnitPrice(product.price, item.unitPrice)) {
        throw new BadRequestException(`Giá món "${product.name}" không hợp lệ`);
      }
      const lineTotal = item.unitPrice * item.quantity;
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal,
        notes: item.notes ?? null,
      };
    });

    const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const { tax_amount, total } = calculateOrderTotal(subtotal);
    const orderNumber = await nextOrderNumber(this.prisma, branchId);
    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      branchId,
    );

    const order = await this.prisma.$transaction(async (tx) => {
      const activeShift = await tx.shift.findFirst({
        where: { branchId, status: ShiftStatus.OPEN },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });

      if (dto.tableId) {
        const activeOnTable = await tx.order.count({
          where: {
            tableId: dto.tableId,
            status: { notIn: [OrderStatus.PAID, OrderStatus.CANCELLED] },
          },
        });
        if (activeOnTable > 0) {
          throw new ConflictException('Bàn đã được chọn');
        }

        const locked = await tx.table.updateMany({
          where: {
            id: dto.tableId,
            branchId,
            status: TableStatus.EMPTY,
          },
          data: { status: TableStatus.OCCUPIED },
        });
        if (locked.count === 0) {
          throw new ConflictException('Bàn đã được chọn hoặc đang có khách');
        }
      }

      const created = await tx.order.create({
        data: {
          branchId,
          shiftId: activeShift?.id ?? null,
          tableId: dto.tableId ?? null,
          orderNumber,
          orderType: dto.orderType,
          status: OrderStatus.PENDING,
          subtotal,
          taxAmount: tax_amount,
          total,
          notes: dto.notes ?? null,
          items: { create: lineItems },
        },
        include: { items: true },
      });

      return created;
    });

    void this.audit.log({
      branchId,
      actorId: actorUserId,
      entityType: 'order',
      entityId: order.id,
      action: 'order.created',
      afterData: {
        orderNumber: order.orderNumber,
        orderType: order.orderType,
        tableId: order.tableId,
        total: order.total,
        itemCount: order.items.length,
      },
      metadata: dto.actedByStaffId
        ? ({ actedByStaffId: dto.actedByStaffId } as import('@prisma/client').Prisma.InputJsonValue)
        : undefined,
    });

    void this.notifications.notifyBranchRoles({
      branchId,
      roles: [StaffRole.BARISTA],
      type: NotificationType.ORDER_NEW,
      title: 'Đơn mới vào bếp',
      body: `Đơn #${order.orderNumber} đang chờ pha`,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    });

    const orderDto = toOrderDto(order);
    this.gateway.emitOrderCreated(branchId, orderDto);

    return orderDto;
  }

  async getById(payload: JwtPayload, orderId: string): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }
    assertBranchAccess(payload, order.branchId);
    return toOrderDto(order);
  }

  async updateStatus(
    payload: JwtPayload,
    orderId: string,
    dto: UpdateOrderStatusDto,
    auditMetadata?: Record<string, unknown>,
  ): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }
    assertBranchAccess(payload, order.branchId);

    const allowed = STATUS_TRANSITIONS[order.status];
    if (!allowed.includes(dto.status)) {
      throw new ConflictException(`Không thể chuyển từ ${order.status} sang ${dto.status}`);
    }

    const effectiveRole = await this.resolveEffectiveStaffRole(
      payload,
      dto.actedByStaffId,
      order.branchId,
    );
    assertStatusRole(effectiveRole, order.status, dto.status);

    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      order.branchId,
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id: orderId },
        data: { status: dto.status },
        include: { items: true },
      });

      if (dto.status === OrderStatus.CANCELLED && order.tableId) {
        await syncTableEmptyIfIdle(tx, order.tableId);
      }

      return result;
    });

    void this.audit.log({
      branchId: order.branchId,
      actorId: actorUserId,
      entityType: 'order',
      entityId: order.id,
      action: `order.status.${dto.status.toLowerCase()}`,
      beforeData: { status: order.status },
      afterData: { status: dto.status },
      metadata: {
        ...(auditMetadata ?? {}),
        ...(dto.actedByStaffId ? { actedByStaffId: dto.actedByStaffId } : {}),
      } as import('@prisma/client').Prisma.InputJsonValue,
    });

    if (dto.status === OrderStatus.READY) {
      void this.notifications.notifyBranchRoles({
        branchId: order.branchId,
        roles: [StaffRole.CASHIER],
        type: NotificationType.ORDER_READY,
        title: 'Món đã xong',
        body: `Đơn #${order.orderNumber} sẵn sàng giao khách`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
      });
    }

    const updatedDto = toOrderDto(updated);
    this.gateway.emitOrderStatusChanged(order.branchId, updatedDto);

    return updatedDto;
  }

  async deliver(payload: JwtPayload, orderId: string, dto: DeliverOrderDto): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }
    assertBranchAccess(payload, order.branchId);

    if (order.status !== OrderStatus.READY) {
      throw new ConflictException('Chỉ đánh dấu đã giao khi đơn ở trạng thái READY');
    }
    if (order.deliveredAt) {
      throw new ConflictException('Đơn đã được đánh dấu giao');
    }

    if (
      payload.role !== StaffRole.CASHIER &&
      payload.role !== StaffRole.BARISTA &&
      payload.role !== StaffRole.MANAGER &&
      payload.role !== StaffRole.OWNER
    ) {
      throw new BadRequestException('Không có quyền xác nhận đã giao món');
    }

    const deliveredAt = new Date();
    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      order.branchId,
    );

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { deliveredAt },
      include: { items: true },
    });

    void this.audit.log({
      branchId: order.branchId,
      actorId: actorUserId,
      entityType: 'order',
      entityId: order.id,
      action: 'order.delivered',
      beforeData: { deliveredAt: null },
      afterData: { deliveredAt: deliveredAt.toISOString() },
      metadata: dto.actedByStaffId
        ? ({ actedByStaffId: dto.actedByStaffId } as import('@prisma/client').Prisma.InputJsonValue)
        : undefined,
    });

    const updatedDto = toOrderDto(updated);
    this.gateway.emitOrderStatusChanged(order.branchId, updatedDto);

    return updatedDto;
  }

  async cancel(payload: JwtPayload, orderId: string, dto: CancelOrderDto): Promise<OrderDto> {
    return this.updateStatus(
      payload,
      orderId,
      { status: OrderStatus.CANCELLED, actedByStaffId: dto.actedByStaffId },
      { reason: dto.reason },
    );
  }

  // US-C03: Toggle item prepared status (barista check từng món)
  async toggleItemPrepared(
    payload: JwtPayload,
    orderId: string,
    itemId: string,
    dto: ToggleItemPreparedDto,
  ): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }
    assertBranchAccess(payload, order.branchId);

    if (order.status !== OrderStatus.MAKING && order.status !== OrderStatus.PENDING) {
      throw new ConflictException('Chỉ đánh dấu món khi đơn đang chờ hoặc đang pha');
    }

    const item = order.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Món không thuộc đơn này');
    }

    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      order.branchId,
    );

    const preparedAt = dto.isPrepared ? new Date() : null;

    await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { isPrepared: dto.isPrepared, preparedAt },
    });

    void this.audit.log({
      branchId: order.branchId,
      actorId: actorUserId,
      entityType: 'order_item',
      entityId: itemId,
      action: dto.isPrepared ? 'order_item.prepared' : 'order_item.unprepared',
      afterData: { isPrepared: dto.isPrepared, orderId, productName: item.productName },
      metadata: dto.actedByStaffId
        ? ({ actedByStaffId: dto.actedByStaffId } as import('@prisma/client').Prisma.InputJsonValue)
        : undefined,
    });

    const updated = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    this.gateway.emitQueueUpdated(order.branchId);

    return toOrderDto(updated!);
  }

  // Task 8.1: GET /orders/queue (barista queue)
  async getQueue(payload: JwtPayload, branchId?: string): Promise<OrderDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    const orders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        status: { in: [OrderStatus.PENDING, OrderStatus.MAKING, OrderStatus.READY] },
      },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    return orders.map((o) => toOrderDto(o));
  }

  /** Station tablet: permission follows actedByStaffId NV, not shared station JWT role. */
  private async resolveEffectiveStaffRole(
    payload: JwtPayload,
    actedByStaffId: string | undefined,
    branchId: string,
  ): Promise<StaffRole> {
    if (!actedByStaffId) {
      return payload.role;
    }

    const actorStaff = await this.prisma.staff.findFirst({
      where: {
        id: actedByStaffId,
        branchId,
        isActive: true,
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
      },
    });

    if (!actorStaff) {
      return payload.role;
    }

    return actorStaff.role;
  }
}
