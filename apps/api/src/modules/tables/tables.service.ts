import { Injectable, NotFoundException } from '@nestjs/common';
import type { TableDto } from '@caffeapp/shared';
import { OrderStatus, TableStatus } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { resolveBranchScope } from '@common/utils/branch-scope.util';
import { effectiveTableStatus, repairBranchTableStatuses } from '@common/utils/table-status.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForBranch(payload: JwtPayload, branchId?: string): Promise<TableDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    await repairBranchTableStatuses(this.prisma, scopedBranchId);

    const tables = await this.prisma.table.findMany({
      where: { branchId: scopedBranchId },
      orderBy: [{ floor: 'asc' }, { code: 'asc' }],
    });

    const activeOrders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        tableId: { not: null },
        status: { notIn: [OrderStatus.PAID, OrderStatus.CANCELLED] },
      },
      select: { id: true, tableId: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const activeMap = new Map<string, { orderId: string; since: Date }>();
    for (const order of activeOrders) {
      if (!order.tableId || activeMap.has(order.tableId)) continue;
      activeMap.set(order.tableId, { orderId: order.id, since: order.createdAt });
    }

    return tables.map((t) => {
      const active = activeMap.get(t.id);
      const status = effectiveTableStatus(t.status, active ? 1 : 0);

      return {
        id: t.id,
        branchId: t.branchId,
        code: t.code,
        floor: t.floor,
        capacity: t.capacity,
        status: status as TableDto['status'],
        occupiedSince:
          status === TableStatus.OCCUPIED && active?.since ? active.since.toISOString() : null,
        activeOrderId: status === TableStatus.OCCUPIED && active?.orderId ? active.orderId : null,
      };
    });
  }

  // Task 7.2: GET /tables/:id endpoint
  async getById(payload: JwtPayload, tableId: string): Promise<TableDto> {
    const scopedBranchId = resolveBranchScope(payload);

    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException('Bàn không tồn tại');
    }

    if (table.branchId !== scopedBranchId) {
      throw new NotFoundException('Bàn không tồn tại');
    }

    // Get active order if any
    const activeOrder = await this.prisma.order.findFirst({
      where: {
        branchId: scopedBranchId,
        tableId: tableId,
        status: { notIn: [OrderStatus.PAID, OrderStatus.CANCELLED] },
      },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
      take: 1,
    });

    const status = effectiveTableStatus(table.status, activeOrder ? 1 : 0);

    return {
      id: table.id,
      branchId: table.branchId,
      code: table.code,
      floor: table.floor,
      capacity: table.capacity,
      status: status as TableDto['status'],
      occupiedSince:
        status === TableStatus.OCCUPIED && activeOrder?.createdAt
          ? activeOrder.createdAt.toISOString()
          : null,
      activeOrderId: status === TableStatus.OCCUPIED && activeOrder?.id ? activeOrder.id : null,
    };
  }

  // Task 7.1: PATCH /tables/:id/status endpoint
  async updateStatus(
    payload: JwtPayload,
    tableId: string,
    dto: UpdateTableStatusDto,
  ): Promise<TableDto> {
    const scopedBranchId = resolveBranchScope(payload);

    // Check table exists and belongs to branch
    const existingTable = await this.prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!existingTable) {
      throw new NotFoundException('Bàn không tồn tại');
    }

    if (existingTable.branchId !== scopedBranchId) {
      throw new NotFoundException('Bàn không tồn tại');
    }

    // Update table status
    const table = await this.prisma.table.update({
      where: { id: tableId },
      data: { status: dto.status },
    });

    // Get active order if any
    const activeOrder = await this.prisma.order.findFirst({
      where: {
        branchId: scopedBranchId,
        tableId: tableId,
        status: { notIn: [OrderStatus.PAID, OrderStatus.CANCELLED] },
      },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
      take: 1,
    });

    const status = effectiveTableStatus(table.status, activeOrder ? 1 : 0);

    return {
      id: table.id,
      branchId: table.branchId,
      code: table.code,
      floor: table.floor,
      capacity: table.capacity,
      status: status as TableDto['status'],
      occupiedSince:
        status === TableStatus.OCCUPIED && activeOrder?.createdAt
          ? activeOrder.createdAt.toISOString()
          : null,
      activeOrderId: status === TableStatus.OCCUPIED && activeOrder?.id ? activeOrder.id : null,
    };
  }
}
