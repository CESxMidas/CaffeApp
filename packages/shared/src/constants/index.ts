import { OrderStatus, StaffRole } from '../enums';

export const VAT_RATE = 0.08;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Chờ pha',
  [OrderStatus.MAKING]: 'Đang pha',
  [OrderStatus.READY]: 'Sẵn sàng',
  [OrderStatus.PAID]: 'Đã thanh toán',
  [OrderStatus.CANCELLED]: 'Đã hủy',
};

export const ROLE_LABELS: Record<string, string> = {
  cashier: 'Thu ngân',
  barista: 'Barista',
  manager: 'Quản lý',
  [StaffRole.OWNER]: 'Chủ quán',
  [StaffRole.MANAGER]: 'Quản lý',
  [StaffRole.CASHIER]: 'Thu ngân',
  [StaffRole.BARISTA]: 'Barista',
};

export const TABLE_STATUS_LABELS: Record<string, string> = {
  EMPTY: 'Trống',
  OCCUPIED: 'Có khách',
  MAINTENANCE: 'Bảo trì',
};

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

export function calculateOrderTotal(subtotal: number, vatRate = VAT_RATE) {
  const tax_amount = Math.round(subtotal * vatRate);
  const total = subtotal + tax_amount;
  return { subtotal, tax_amount, total };
}
