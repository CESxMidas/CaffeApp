export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKE_AWAY = 'TAKE_AWAY',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  MAKING = 'MAKING',
  READY = 'READY',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
  E_WALLET = 'E_WALLET',
}

export enum StaffRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  BARISTA = 'BARISTA',
}

export enum TableStatus {
  EMPTY = 'EMPTY',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum ShiftStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

/** Manager proposes branch → Owner approves before staff can work. */
export enum BranchAssignmentStatus {
  NONE = 'NONE',
  PENDING_OWNER = 'PENDING_OWNER',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
