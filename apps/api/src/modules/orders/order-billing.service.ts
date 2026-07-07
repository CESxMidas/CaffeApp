import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { OrderDto } from '@caffeapp/shared';
import { OrderStatus, OrderType, TableStatus, type Prisma } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { AuditService } from '@common/audit/audit.service';
import { ActorResolverService } from '@common/audit/actor-resolver.service';
import { assertBranchAccess } from '@common/utils/branch-scope.util';
import { syncTableEmptyIfIdle } from '@common/utils/table-status.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { OrdersGateway } from './orders.gateway';
import { ACTIVE_ORDER_STATUSES } from './orders.constants';
import type { OrderWithItemsAndPayments } from './orders.types';
import {
  auditOrderSnapshot,
  mergeDeliveredAt,
  mergeStatus,
  toOrderDto,
  totalsFromItems,
} from './order.mapper';
import { assertOrderCanBeRebilled, nextOrderNumber } from './order-policy.util';
import type { MergeOrdersDto } from './dto/merge-orders.dto';
import type { SplitOrderDto } from './dto/split-order.dto';
import type { TransferOrderTableDto } from './dto/transfer-order-table.dto';

@Injectable()
export class OrderBillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly actorResolver: ActorResolverService,
    private readonly gateway: OrdersGateway,
  ) {}

  async transferTable(
    payload: JwtPayload,
    orderId: string,
    dto: TransferOrderTableDto,
  ): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payments: true },
    });
    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }
    assertBranchAccess(payload, order.branchId);
    assertOrderCanBeRebilled(order);

    if (order.orderType !== OrderType.DINE_IN) {
      throw new BadRequestException('Chỉ đơn tại bàn mới được chuyển bàn');
    }

    const table = await this.prisma.table.findFirst({
      where: { id: dto.tableId, branchId: order.branchId },
    });
    if (!table) {
      throw new NotFoundException('Bàn không tồn tại');
    }
    if (table.status === TableStatus.MAINTENANCE) {
      throw new ConflictException('Bàn đang bảo trì');
    }
    if (order.tableId === dto.tableId) {
      return toOrderDto(order);
    }

    const targetOrders = await this.prisma.order.findMany({
      where: {
        branchId: order.branchId,
        tableId: dto.tableId,
        status: { in: ACTIVE_ORDER_STATUSES },
      },
      include: { items: true, payments: true },
      orderBy: { createdAt: 'asc' },
    });

    const occupiedByOtherOrder = targetOrders.find((target) => target.id !== order.id);
    if (occupiedByOtherOrder) {
      if (!dto.mergeIntoOccupied) {
        throw new ConflictException('Bàn đã có đơn đang phục vụ');
      }
      return this.mergeOrders(payload, {
        targetOrderId: occupiedByOtherOrder.id,
        sourceOrderIds: [order.id],
        actedByStaffId: dto.actedByStaffId,
      });
    }

    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      order.branchId,
    );
    const before = auditOrderSnapshot(order);

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id: order.id },
        data: { tableId: dto.tableId },
        include: { items: true },
      });

      await tx.table.update({
        where: { id: dto.tableId },
        data: { status: TableStatus.OCCUPIED },
      });

      if (order.tableId) {
        await syncTableEmptyIfIdle(tx, order.tableId);
      }

      return result;
    });

    void this.audit.log({
      branchId: order.branchId,
      actorId: actorUserId,
      entityType: 'order',
      entityId: order.id,
      action: 'order.table.transferred',
      beforeData: before as Prisma.InputJsonValue,
      afterData: auditOrderSnapshot(updated) as Prisma.InputJsonValue,
      metadata: {
        fromTableId: order.tableId,
        toTableId: dto.tableId,
        ...(dto.actedByStaffId ? { actedByStaffId: dto.actedByStaffId } : {}),
      } as Prisma.InputJsonValue,
    });

    const updatedDto = toOrderDto(updated);
    this.gateway.emitOrderStatusChanged(order.branchId, updatedDto);

    return updatedDto;
  }

  async mergeOrders(payload: JwtPayload, dto: MergeOrdersDto): Promise<OrderDto> {
    const sourceOrderIds = Array.from(new Set(dto.sourceOrderIds)).filter(
      (sourceId) => sourceId !== dto.targetOrderId,
    );
    if (sourceOrderIds.length === 0) {
      throw new BadRequestException('Cần chọn ít nhất một đơn để gộp');
    }

    const target = await this.prisma.order.findUnique({
      where: { id: dto.targetOrderId },
      include: { items: true, payments: true },
    });
    if (!target) {
      throw new NotFoundException('Đơn đích không tồn tại');
    }
    assertBranchAccess(payload, target.branchId);
    assertOrderCanBeRebilled(target);

    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      target.branchId,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const txTarget = await tx.order.findUnique({
        where: { id: target.id },
        include: { items: true, payments: true },
      });
      if (!txTarget) {
        throw new NotFoundException('Đơn đích không tồn tại');
      }
      assertOrderCanBeRebilled(txTarget);

      const foundSources = await tx.order.findMany({
        where: { id: { in: sourceOrderIds } },
        include: { items: true, payments: true },
      });
      const foundSourcesById = new Map(foundSources.map((source) => [source.id, source]));

      const sources: OrderWithItemsAndPayments[] = [];
      for (const sourceOrderId of sourceOrderIds) {
        const source = foundSourcesById.get(sourceOrderId);
        if (!source) {
          throw new NotFoundException('Đơn cần gộp không tồn tại');
        }
        if (source.branchId !== txTarget.branchId) {
          throw new BadRequestException('Không thể gộp đơn khác chi nhánh');
        }
        assertOrderCanBeRebilled(source);
        sources.push(source);
      }

      const before = {
        target: auditOrderSnapshot(txTarget),
        sources: sources.map((source) => auditOrderSnapshot(source)),
      };
      const movedItemIds = sources.flatMap((source) => source.items.map((item) => item.id));

      for (const source of sources) {
        await tx.orderItem.updateMany({
          where: { orderId: source.id },
          data: { orderId: txTarget.id },
        });
      }

      const mergedItems = [...txTarget.items, ...sources.flatMap((source) => source.items)];
      const totals = totalsFromItems(mergedItems);
      const mergedStatus = mergeStatus([txTarget, ...sources]);
      const deliveredAt = mergeDeliveredAt(mergedStatus, [txTarget, ...sources]);

      const updatedTarget = await tx.order.update({
        where: { id: txTarget.id },
        data: {
          ...totals,
          status: mergedStatus,
          deliveredAt,
        },
        include: { items: true },
      });

      for (const source of sources) {
        await tx.order.update({
          where: { id: source.id },
          data: {
            status: OrderStatus.CANCELLED,
            subtotal: 0,
            taxAmount: 0,
            total: 0,
            deliveredAt: null,
          },
        });

        if (source.tableId && source.tableId !== txTarget.tableId) {
          await syncTableEmptyIfIdle(tx, source.tableId);
        }
      }

      if (txTarget.tableId) {
        await tx.table.update({
          where: { id: txTarget.tableId },
          data: { status: TableStatus.OCCUPIED },
        });
      }

      return {
        updatedTarget,
        before,
        after: {
          target: auditOrderSnapshot(updatedTarget),
          sources: sources.map((source) => ({
            ...auditOrderSnapshot(source),
            status: OrderStatus.CANCELLED,
            subtotal: 0,
            taxAmount: 0,
            total: 0,
          })),
          movedItemIds,
        },
      };
    });

    void this.audit.log({
      branchId: target.branchId,
      actorId: actorUserId,
      entityType: 'order',
      entityId: target.id,
      action: 'order.merge',
      beforeData: result.before as Prisma.InputJsonValue,
      afterData: result.after as Prisma.InputJsonValue,
      metadata: {
        sourceOrderIds,
        ...(dto.actedByStaffId ? { actedByStaffId: dto.actedByStaffId } : {}),
      } as Prisma.InputJsonValue,
    });

    const updatedDto = toOrderDto(result.updatedTarget);
    this.gateway.emitOrderStatusChanged(target.branchId, updatedDto);

    return updatedDto;
  }

  async splitOrder(
    payload: JwtPayload,
    orderId: string,
    dto: SplitOrderDto,
  ): Promise<{ sourceOrder: OrderDto; splitOrder: OrderDto }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payments: true },
    });
    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }
    assertBranchAccess(payload, order.branchId);
    assertOrderCanBeRebilled(order);

    const splitMap = new Map<string, number>();
    for (const item of dto.items) {
      splitMap.set(item.itemId, (splitMap.get(item.itemId) ?? 0) + item.quantity);
    }

    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const splitQuantity = Array.from(splitMap.values()).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
    if (splitQuantity >= totalQuantity) {
      throw new BadRequestException('Bill gốc phải còn ít nhất một món');
    }

    for (const [itemId, quantity] of splitMap.entries()) {
      const item = order.items.find((entry) => entry.id === itemId);
      if (!item) {
        throw new BadRequestException('Món tách bill không thuộc đơn này');
      }
      if (quantity > item.quantity) {
        throw new BadRequestException('Số lượng tách bill vượt quá số món');
      }
    }

    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      order.branchId,
    );

    const orderNumber = await nextOrderNumber(this.prisma, order.branchId);
    const before = auditOrderSnapshot(order);

    const result = await this.prisma.$transaction(async (tx) => {
      const splitItems = order.items
        .map((item) => {
          const quantity = splitMap.get(item.id) ?? 0;
          if (quantity === 0) return null;
          return {
            originalItem: item,
            quantity,
            lineTotal: item.unitPrice * quantity,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      const splitTotals = totalsFromItems(
        splitItems.map((item) => ({
          lineTotal: item.lineTotal,
        })),
      );

      const splitOrder = await tx.order.create({
        data: {
          branchId: order.branchId,
          shiftId: order.shiftId,
          tableId: order.tableId,
          orderNumber,
          orderType: order.orderType,
          status: order.status,
          subtotal: splitTotals.subtotal,
          taxAmount: splitTotals.taxAmount,
          total: splitTotals.total,
          notes: order.notes,
          deliveredAt: order.deliveredAt,
          items: {
            create: splitItems.map(({ originalItem, quantity, lineTotal }) => ({
              productId: originalItem.productId,
              productName: originalItem.productName,
              quantity,
              unitPrice: originalItem.unitPrice,
              lineTotal,
              notes: originalItem.notes,
              isPrepared: originalItem.isPrepared,
              preparedAt: originalItem.preparedAt,
            })),
          },
        },
        include: { items: true },
      });

      for (const { originalItem, quantity } of splitItems) {
        const remainingQuantity = originalItem.quantity - quantity;
        if (remainingQuantity === 0) {
          await tx.orderItem.delete({ where: { id: originalItem.id } });
        } else {
          await tx.orderItem.update({
            where: { id: originalItem.id },
            data: {
              quantity: remainingQuantity,
              lineTotal: originalItem.unitPrice * remainingQuantity,
            },
          });
        }
      }

      const remainingItems = order.items
        .map((item) => {
          const movedQuantity = splitMap.get(item.id) ?? 0;
          const quantity = item.quantity - movedQuantity;
          if (quantity <= 0) return null;
          return { ...item, quantity, lineTotal: item.unitPrice * quantity };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
      const sourceTotals = totalsFromItems(remainingItems);

      const sourceOrder = await tx.order.update({
        where: { id: order.id },
        data: sourceTotals,
        include: { items: true },
      });

      return { sourceOrder, splitOrder };
    });

    void this.audit.log({
      branchId: order.branchId,
      actorId: actorUserId,
      entityType: 'order',
      entityId: order.id,
      action: 'order.split',
      beforeData: before as Prisma.InputJsonValue,
      afterData: {
        sourceOrder: auditOrderSnapshot(result.sourceOrder),
        splitOrder: auditOrderSnapshot(result.splitOrder),
        movedItems: Array.from(splitMap.entries()).map(([itemId, quantity]) => ({
          itemId,
          quantity,
        })),
      } as Prisma.InputJsonValue,
      metadata: dto.actedByStaffId
        ? ({ actedByStaffId: dto.actedByStaffId } as Prisma.InputJsonValue)
        : undefined,
    });

    const sourceDto = toOrderDto(result.sourceOrder);
    const splitDto = toOrderDto(result.splitOrder);
    this.gateway.emitOrderStatusChanged(order.branchId, sourceDto);
    this.gateway.emitOrderCreated(order.branchId, splitDto);

    return { sourceOrder: sourceDto, splitOrder: splitDto };
  }
}
