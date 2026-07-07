import type { OrderDto } from '@caffeapp/shared';
import { calculateOrderTotal } from '@caffeapp/shared';
import { OrderStatus } from '@prisma/client';

export function toOrderDto(o: {
  id: string;
  branchId: string;
  tableId: string | null;
  shiftId: string | null;
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
    isPrepared: boolean;
    preparedAt: Date | null;
  }>;
}): OrderDto {
  return {
    id: o.id,
    branchId: o.branchId,
    shiftId: o.shiftId,
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
      isPrepared: item.isPrepared,
      preparedAt: item.preparedAt?.toISOString() ?? null,
    })),
  };
}

export function totalsFromItems(items: Array<{ lineTotal: number }>): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const { tax_amount, total } = calculateOrderTotal(subtotal);
  return { subtotal, taxAmount: tax_amount, total };
}

export function mergeStatus(orders: Array<{ status: OrderStatus }>): OrderStatus {
  const rank: Record<OrderStatus, number> = {
    [OrderStatus.PENDING]: 0,
    [OrderStatus.MAKING]: 1,
    [OrderStatus.READY]: 2,
    [OrderStatus.PAID]: 3,
    [OrderStatus.CANCELLED]: 4,
  };

  let current: OrderStatus = OrderStatus.READY;
  for (const order of orders) {
    if (rank[order.status] < rank[current]) {
      current = order.status;
    }
  }
  return current;
}

export function mergeDeliveredAt(
  status: OrderStatus,
  orders: Array<{ deliveredAt: Date | null }>,
): Date | null {
  if (status !== OrderStatus.READY) {
    return null;
  }
  if (orders.some((order) => !order.deliveredAt)) {
    return null;
  }
  return orders[0]?.deliveredAt ?? null;
}

export function auditOrderSnapshot(order: {
  id: string;
  tableId: string | null;
  orderNumber: string;
  orderType: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  deliveredAt?: Date | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    notes: string | null;
  }>;
}) {
  return {
    id: order.id,
    tableId: order.tableId,
    orderNumber: order.orderNumber,
    orderType: order.orderType,
    status: order.status,
    subtotal: order.subtotal,
    taxAmount: order.taxAmount,
    total: order.total,
    deliveredAt: order.deliveredAt?.toISOString() ?? null,
    items: order.items.map((item) => ({
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
