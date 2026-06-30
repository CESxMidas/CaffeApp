import { Injectable } from '@nestjs/common';
import type { TableDto } from '@caffeapp/shared';
import { OrderStatus, TableStatus } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { resolveBranchScope } from '@common/utils/branch-scope.util';
import { effectiveTableStatus, repairBranchTableStatuses } from '@common/utils/table-status.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';

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
}
