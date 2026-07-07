import { OrderStatus } from '@prisma/client';

// READY -> PAID is intentionally excluded here: it is only ever reached via
// PaymentsService.create (payment recorded), never through the generic
// order status-update endpoint. Do not add PAID to this map — doing so
// would let staff mark an order paid without recording a payment.
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.MAKING, OrderStatus.CANCELLED],
  [OrderStatus.MAKING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [],
  [OrderStatus.CANCELLED]: [],
};

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.MAKING,
  OrderStatus.READY,
];
