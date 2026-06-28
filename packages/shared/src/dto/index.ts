import type { OrderStatus, OrderType, PaymentMethod, StaffRole, TableStatus } from '../enums';

/** API request/response contracts shared between mobile and NestJS */

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
  staff: StaffDto;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
}

export interface StaffDto {
  id: string;
  userId: string;
  branchId: string | null;
  role: StaffRole;
  fullName: string;
  isActive: boolean;
}

export interface BranchDto {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
}

export interface TableDto {
  id: string;
  branchId: string;
  code: string;
  floor: string | null;
  capacity: number;
  status: TableStatus;
}

export interface ProductCategoryDto {
  id: string;
  branchId: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductDto {
  id: string;
  branchId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface OrderItemDto {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  notes: string | null;
}

export interface OrderDto {
  id: string;
  branchId: string;
  tableId: string | null;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  items: OrderItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  branchId: string;
  orderType: OrderType;
  tableId?: string;
  notes?: string;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface CreatePaymentDto {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  changeAmount?: number;
  reference?: string;
}

export interface PaymentDto {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  changeAmount: number | null;
  reference: string | null;
  paidAt: string;
}

export interface ApiErrorDto {
  statusCode: number;
  message: string;
  error?: string;
}
