import { OrderStatus, TableStatus, type Prisma } from '@prisma/client';

const INACTIVE_ORDER_STATUSES: OrderStatus[] = [OrderStatus.PAID, OrderStatus.CANCELLED];

/** Trả bàn về EMPTY khi không còn đơn dine-in đang active trên bàn đó. */
export async function syncTableEmptyIfIdle(
  tx: Prisma.TransactionClient,
  tableId: string,
): Promise<void> {
  const activeOrders = await tx.order.count({
    where: {
      tableId,
      status: { notIn: INACTIVE_ORDER_STATUSES },
    },
  });

  if (activeOrders === 0) {
    await tx.table.update({
      where: { id: tableId },
      data: { status: TableStatus.EMPTY },
    });
  }
}

export function effectiveTableStatus(
  storedStatus: TableStatus,
  activeOrderCount: number,
): TableStatus {
  if (storedStatus === TableStatus.MAINTENANCE) return TableStatus.MAINTENANCE;
  return activeOrderCount > 0 ? TableStatus.OCCUPIED : TableStatus.EMPTY;
}

/** Sửa trạng thái bàn lệch so với đơn đang active (seed demo, thanh toán cũ, v.v.). */
export async function repairBranchTableStatuses(
  prisma:
    | Prisma.TransactionClient
    | { table: Prisma.TransactionClient['table']; order: Prisma.TransactionClient['order'] },
  branchId: string,
): Promise<void> {
  const tables = await prisma.table.findMany({
    where: { branchId },
    select: { id: true, status: true },
  });

  const activeByTable = await prisma.order.groupBy({
    by: ['tableId'],
    where: {
      branchId,
      tableId: { not: null },
      status: { notIn: INACTIVE_ORDER_STATUSES },
    },
    _count: { id: true },
  });

  const activeCountMap = new Map(
    activeByTable
      .filter((row): row is typeof row & { tableId: string } => row.tableId != null)
      .map((row) => [row.tableId, row._count.id]),
  );

  await Promise.all(
    tables.map((table) => {
      const activeCount = activeCountMap.get(table.id) ?? 0;
      const nextStatus = effectiveTableStatus(table.status, activeCount);
      if (table.status === nextStatus) return Promise.resolve();
      return prisma.table.update({
        where: { id: table.id },
        data: { status: nextStatus },
      });
    }),
  );
}
