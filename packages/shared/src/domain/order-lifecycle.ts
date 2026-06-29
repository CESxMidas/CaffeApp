import { OrderStatus } from '../enums';
import type { OrderDto } from '../dto';

type OrderDeliveryFields = Pick<OrderDto, 'status' | 'deliveredAt'>;

/** READY + chưa ấn Đã giao — tab Chờ giao (C-14). */
export function isAwaitingDelivery(order: OrderDeliveryFields): boolean {
  return order.status === OrderStatus.READY && order.deliveredAt == null;
}

/** READY + đã giao — tab Chờ thanh toán (C-14). */
export function isAwaitingPayment(order: OrderDeliveryFields): boolean {
  return order.status === OrderStatus.READY && order.deliveredAt != null;
}
