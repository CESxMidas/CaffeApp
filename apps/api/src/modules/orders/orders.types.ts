import type { OrderStatus, OrderType } from '@prisma/client';

export type DeliveryStateFilter = 'awaiting_delivery' | 'awaiting_payment';

export type OrderWithItemsAndPayments = {
  id: string;
  branchId: string;
  shiftId: string | null;
  tableId: string | null;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date | null;
  paidAt: Date | null;
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
  payments?: Array<{ id: string }>;
};
