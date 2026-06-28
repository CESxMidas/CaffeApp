import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { OrderDto } from '@caffeapp/shared';
import { calculateOrderTotal } from '@caffeapp/shared';
import { OrderStatus, OrderType, StaffRole, TableStatus, NotificationType } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { assertBranchAccess, resolveBranchScope } from '@common/utils/branch-scope.util';
import { syncTableEmptyIfIdle } from '@common/utils/table-status.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { NotificationsService } from '@modules/notifications/notifications.service';
import type { CreateOrderDto as CreateOrderBodyDto } from './dto/create-order.dto';
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.MAKING, OrderStatus.CANCELLED],
  [OrderStatus.MAKING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.SERVING, OrderStatus.CANCELLED],
  [OrderStatus.SERVING]: [OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [],
  [OrderStatus.CANCELLED]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async listForBranch(
    payload: JwtPayload,
    branchId?: string,
    statusFilter?: string,
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
        ...(statuses?.length ? { status: { in: statuses } } : {}),
      },
      include: { items: true },
      orderBy: {
        createdAt: payload.role === StaffRole.BARISTA ? 'asc' : 'desc',
      },
      take: 100,
    });

    return orders.map((o) => this.toOrderDto(o));
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
      if (table.status !== TableStatus.EMPTY) {
        throw new BadRequestException('Bàn đang có khách');
      }
    }

    const lineItems = dto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const lineTotal = product.price * item.quantity;
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal,
        notes: item.notes ?? null,
      };
    });

    const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const { tax_amount, total } = calculateOrderTotal(subtotal);
    const orderNumber = await this.nextOrderNumber(branchId);

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          branchId,
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

      if (dto.tableId) {
        await tx.table.update({
          where: { id: dto.tableId },
          data: { status: TableStatus.OCCUPIED },
        });
      }

      return created;
    });

    void this.notifications.notifyBranchRoles({
      branchId,
      roles: [StaffRole.BARISTA],
      type: NotificationType.ORDER_NEW,
      title: 'Đơn mới vào bếp',
      body: `Đơn #${order.orderNumber} đang chờ pha`,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    });

    return this.toOrderDto(order);
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
    return this.toOrderDto(order);
  }

  async updateStatus(
    payload: JwtPayload,
    orderId: string,
    dto: UpdateOrderStatusDto,
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

    this.assertStatusRole(payload, order.status, dto.status);

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

    return this.toOrderDto(updated);
  }

  async cancel(payload: JwtPayload, orderId: string, reason: string): Promise<OrderDto> {
    void reason;
    return this.updateStatus(payload, orderId, { status: OrderStatus.CANCELLED });
  }

  private assertStatusRole(
    payload: JwtPayload,
    from: OrderStatus,
    to: OrderStatus,
  ): void {
    const role = payload.role;

    if (to === OrderStatus.CANCELLED) {
      if (from === OrderStatus.READY || from === OrderStatus.SERVING) {
        if (role !== StaffRole.MANAGER && role !== StaffRole.OWNER) {
          throw new BadRequestException('Chỉ quản lý mới hủy đơn đã sẵn sàng');
        }
      }
      return;
    }

    if (to === OrderStatus.MAKING) {
      return;
    }

    if (to === OrderStatus.READY) {
      if (
        role !== StaffRole.BARISTA &&
        role !== StaffRole.MANAGER &&
        role !== StaffRole.OWNER
      ) {
        throw new BadRequestException('Chỉ barista mới đánh dấu hoàn thành pha');
      }
    }

    if (to === OrderStatus.SERVING) {
      if (
        role !== StaffRole.CASHIER &&
        role !== StaffRole.BARISTA &&
        role !== StaffRole.MANAGER &&
        role !== StaffRole.OWNER
      ) {
        throw new BadRequestException('Chỉ nhân viên quầy mới xác nhận đã giao nước');
      }
    }
  }

  private async nextOrderNumber(branchId: string): Promise<string> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const count = await this.prisma.order.count({
      where: { branchId, createdAt: { gte: start } },
    });
    const date = start.toISOString().slice(0, 10).replace(/-/g, '');
    return `${date}-${String(count + 1).padStart(3, '0')}`;
  }

  private toOrderDto(o: {
    id: string;
    branchId: string;
    tableId: string | null;
    orderNumber: string;
    orderType: string;
    status: string;
    subtotal: number;
    taxAmount: number;
    total: number;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: Array<{
      id: string;
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      notes: string | null;
    }>;
  }): OrderDto {
    return {
      id: o.id,
      branchId: o.branchId,
      tableId: o.tableId,
      orderNumber: o.orderNumber,
      orderType: o.orderType as OrderDto['orderType'],
      status: o.status as OrderDto['status'],
      subtotal: o.subtotal,
      taxAmount: o.taxAmount,
      total: o.total,
      notes: o.notes,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: o.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        notes: item.notes,
      })),
    };
  }
}
