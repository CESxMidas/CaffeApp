import type { OrderDto } from '@caffeapp/shared';

export interface TableOrdersDto {
  tableId: string;
  tableCode: string;
  tableFloor?: string | null;
  orders: OrderDto[];
  totalAmount: number;
  activeOrderCount: number;
}
