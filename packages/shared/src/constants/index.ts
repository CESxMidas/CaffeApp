import { BranchAssignmentStatus, OrderStatus, StaffRole } from '../enums';

export const VAT_RATE = 0.08;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Chờ pha',
  [OrderStatus.MAKING]: 'Đang pha',
  [OrderStatus.READY]: 'Sẵn sàng',
  [OrderStatus.SERVING]: 'Đang phục vụ',
  [OrderStatus.PAID]: 'Đã thanh toán',
  [OrderStatus.CANCELLED]: 'Đã hủy',
};

/** Drink size — M dùng giá gốc sản phẩm. */
export type DrinkSize = 'S' | 'M' | 'L';

export const SIZE_PRICE_DELTA: Record<DrinkSize, number> = {
  S: -3_000,
  M: 0,
  L: 5_000,
};

export function priceForSize(basePrice: number, size: DrinkSize): number {
  return Math.max(0, basePrice + SIZE_PRICE_DELTA[size]);
}

export const ROLE_LABELS: Record<string, string> = {
  cashier: 'Phục vụ bàn',
  barista: 'Barista',
  manager: 'Quản lý',
  [StaffRole.OWNER]: 'Chủ quán',
  [StaffRole.MANAGER]: 'Quản lý',
  [StaffRole.CASHIER]: 'Phục vụ bàn',
  [StaffRole.BARISTA]: 'Barista',
};

export const BRANCH_ASSIGNMENT_STATUS_LABELS: Record<BranchAssignmentStatus, string> = {
  [BranchAssignmentStatus.NONE]: 'Chưa gán',
  [BranchAssignmentStatus.PENDING_OWNER]: 'Chờ duyệt',
  [BranchAssignmentStatus.APPROVED]: 'Đã duyệt',
  [BranchAssignmentStatus.REJECTED]: 'Bị từ chối',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
  E_WALLET: 'Ví điện tử',
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
