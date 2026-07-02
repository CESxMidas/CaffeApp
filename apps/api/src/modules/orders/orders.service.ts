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
} from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { AuditService } from '@common/audit/audit.service';
import { ActorResolverService } from '@common/audit/actor-resolver.service';
import { assertBranchAccess, resolveBranchScope } from '@common/utils/branch-scope.util';
import { syncTableEmptyIfIdle } from '@common/utils/table-status.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { NotificationsService } from '@modules/notifications/notifications.service';
import type { CancelOrderDto } from './dto/cancel-order.dto';
import type { CreateOrderDto as CreateOrderBodyDto } from './dto/create-order.dto';
import type { DeliverOrderDto } from './dto/deliver-order.dto';
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { OrderStatsDto } from './dto/order-stats.dto';

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.MAKING, OrderStatus.CANCELLED],
  [OrderStatus.MAKING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [],
  [OrderStatus.CANCELLED]: [],
};

export type DeliveryStateFilter = 'awaiting_delivery' | 'awaiting_payment';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
    private readonly actorResolver: ActorResolverService,
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
    const orderNumber = await this.nextOrderNumber(branchId);
    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      branchId,
    );

    const order = await this.prisma.$transaction(async (tx) => {
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
    this.assertStatusRole(effectiveRole, order.status, dto.status);

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

    return this.toOrderDto(updated);
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

    return this.toOrderDto(updated);
  }

  async cancel(payload: JwtPayload, orderId: string, dto: CancelOrderDto): Promise<OrderDto> {
    return this.updateStatus(
      payload,
      orderId,
      { status: OrderStatus.CANCELLED, actedByStaffId: dto.actedByStaffId },
      { reason: dto.reason },
    );
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

    return orders.map((o) => this.toOrderDto(o));
  }

  // FR-D02: GET /orders/stats/hourly (revenue by hour)
  async getHourlyStats(
    payload: JwtPayload,
    branchId?: string,
    date?: string,
  ): Promise<{ hour: number; revenue: number; orders: number }[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    // Build date filter
    let start: Date;
    let end: Date;
    if (date) {
      start = new Date(date);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    } else {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    }

    // Get PAID orders for the day
    const orders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        status: OrderStatus.PAID,
        createdAt: { gte: start, lt: end },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Group by hour
    const hourlyMap = new Map<number, { revenue: number; orders: number }>();
    for (let h = 0; h < 24; h++) {
      hourlyMap.set(h, { revenue: 0, orders: 0 });
    }

    for (const order of orders) {
      const hour = order.createdAt.getHours();
      const data = hourlyMap.get(hour)!;
      data.revenue += order.total;
      data.orders++;
    }

    // Convert to array sorted by hour
    return Array.from(hourlyMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([hour, data]) => ({
        hour,
        revenue: data.revenue,
        orders: data.orders,
      }));
  }

  // Task 8.2: GET /orders/stats (statistics)
  async getStats(payload: JwtPayload, branchId?: string, date?: string): Promise<OrderStatsDto> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    // Build date filter
    let dateFilter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      dateFilter = { createdAt: { gte: start, lt: end } };
    }

    // Get orders with status counts
    const orders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        ...dateFilter,
      },
      select: {
        status: true,
        total: true,
      },
    });

    // Calculate stats by status
    const statusCounts: Record<string, { count: number; revenue: number }> = {
      PENDING: { count: 0, revenue: 0 },
      MAKING: { count: 0, revenue: 0 },
      READY: { count: 0, revenue: 0 },
      PAID: { count: 0, revenue: 0 },
      CANCELLED: { count: 0, revenue: 0 },
    };

    let totalRevenue = 0;
    for (const order of orders) {
      statusCounts[order.status].count++;
      if (order.status === OrderStatus.PAID) {
        statusCounts[order.status].revenue += order.total;
        totalRevenue += order.total;
      }
    }

    const totalOrders = orders.length;
    const paidOrders = statusCounts[OrderStatus.PAID].count;

    return {
      summary: {
        totalOrders,
        pendingOrders: statusCounts[OrderStatus.PENDING].count,
        makingOrders: statusCounts[OrderStatus.MAKING].count,
        readyOrders: statusCounts[OrderStatus.READY].count,
        deliveredOrders: 0, // deprecated - no longer tracked separately
        paidOrders,
        cancelledOrders: statusCounts[OrderStatus.CANCELLED].count,
        totalRevenue,
        averageOrderValue: paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0,
      },
      byStatus: Object.entries(statusCounts).map(([status, data]) => ({
        status,
        count: data.count,
        revenue: data.revenue,
      })),
    };
  }

  private assertStatusRole(role: StaffRole, from: OrderStatus, to: OrderStatus): void {
    if (to === OrderStatus.CANCELLED) {
      if (from === OrderStatus.READY) {
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
      if (role !== StaffRole.BARISTA && role !== StaffRole.MANAGER && role !== StaffRole.OWNER) {
        throw new BadRequestException('Chỉ barista mới đánh dấu hoàn thành pha');
      }
    }
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
    deliveredAt?: Date | null;
    paidAt?: Date | null;
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
      deliveredAt: o.deliveredAt?.toISOString() ?? null,
      paidAt: o.paidAt?.toISOString() ?? null,
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

  // Task 12.1: GET /orders/my-tables (cashier view - orders grouped by table)
  async getOrdersByTables(
    payload: JwtPayload,
    branchId?: string,
  ): Promise<import('./dto/table-orders.dto').TableOrdersDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    // Get all tables in branch
    const tables = await this.prisma.table.findMany({
      where: { branchId: scopedBranchId },
      orderBy: [{ floor: 'asc' }, { code: 'asc' }],
    });

    // Get active orders (not PAID or CANCELLED)
    const activeOrders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        status: { notIn: [OrderStatus.PAID, OrderStatus.CANCELLED] },
        tableId: { not: null },
      },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group orders by table
    const tableMap = new Map<string, import('./dto/table-orders.dto').TableOrdersDto>();

    // Initialize all tables
    for (const table of tables) {
      tableMap.set(table.id, {
        tableId: table.id,
        tableCode: table.code,
        tableFloor: table.floor,
        orders: [],
        totalAmount: 0,
        activeOrderCount: 0,
      });
    }

    // Add orders to tables
    for (const order of activeOrders) {
      if (!order.tableId) continue;

      const tableData = tableMap.get(order.tableId);
      if (tableData) {
        tableData.orders.push(this.toOrderDto(order));
        tableData.totalAmount += order.total;
        tableData.activeOrderCount++;
      }
    }

    // Return only tables with orders or all tables
    return Array.from(tableMap.values());
  }

  // Task 12.2: GET /orders/history (order history with date filters)
  async getHistory(
    payload: JwtPayload,
    branchId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<OrderDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { gte: start, lte: end } };
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { gte: start } };
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { lte: end } };
    }

    // Get completed orders (PAID, CANCELLED)
    const orders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        status: { in: [OrderStatus.PAID, OrderStatus.CANCELLED] },
        ...dateFilter,
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return orders.map((o) => this.toOrderDto(o));
  }
}
