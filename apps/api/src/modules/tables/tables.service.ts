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

    const activeByTable = await this.prisma.order.groupBy({
      by: ['tableId'],
      where: {
        branchId: scopedBranchId,
        tableId: { not: null },
        status: { notIn: [OrderStatus.PAID, OrderStatus.CANCELLED] },
      },
      _count: { id: true },
      _min: { createdAt: true },
    });

    const activeMap = new Map(
      activeByTable
        .filter((row) => row.tableId)
        .map((row) => [
          row.tableId!,
          { count: row._count.id, since: row._min.createdAt },
        ]),
    );

    return tables.map((t) => {
      const active = activeMap.get(t.id);
      const status = effectiveTableStatus(t.status, active?.count ?? 0);

      return {
        id: t.id,
        branchId: t.branchId,
        code: t.code,
        floor: t.floor,
        capacity: t.capacity,
        status: status as TableDto['status'],
        occupiedSince:
          status === TableStatus.OCCUPIED && active?.since
            ? active.since.toISOString()
            : null,
      };
    });
  }
}
