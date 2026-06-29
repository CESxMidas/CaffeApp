import type {
  OrderStatus,
  OrderType,
  PaymentMethod,
  StaffRole,
  TableStatus,
  BranchAssignmentStatus,
} from '../enums';

/** API request/response contracts shared between mobile and NestJS */

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
  staff: StaffDto;
  /** Assigned branch (staff: only when APPROVED; owner: null until session pick). */
  branch: BranchDto | null;
}

export interface MeResponseDto {
  user: UserDto;
  staff: StaffDto;
  branch: BranchDto | null;
}

export interface ApiDataResponse<T> {
  data: T;
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
  branchAssignmentStatus: BranchAssignmentStatus;
  /** True for shared tablet station login (A-09). */
  isStationAccount?: boolean;
}

/** Staff row for manager/owner lists (includes email + branch name). */
export interface StaffListItemDto extends StaffDto {
  email: string;
  branchName: string | null;
}

/** Active branch staff for station tablet picker (excludes station accounts). */
export interface BranchOperatorDto {
  id: string;
  fullName: string;
  role: StaffRole;
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
  /** ISO timestamp — đơn active sớm nhất trên bàn (để hiển thị thời gian phục vụ). */
  occupiedSince?: string | null;
  /** Đơn đang active trên bàn (US-B02 — xem đơn hiện tại). */
  activeOrderId?: string | null;
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
  /** Populated on menu list endpoints */
  categoryName?: string;
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
  deliveredAt: string | null;
  paidAt: string | null;
}

export interface CreateOrderDto {
  branchId: string;
  orderType: OrderType;
  tableId?: string;
  notes?: string;
  actedByStaffId?: string;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
  /** Giá sau size/modifier — BE validate với giá sản phẩm gốc. */
  unitPrice: number;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  actedByStaffId?: string;
}

export interface DeliverOrderRequestDto {
  actedByStaffId?: string;
}

export interface CreatePaymentDto {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  changeAmount?: number;
  reference?: string;
  actedByStaffId?: string;
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

export interface RevenueReportDto {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    cancelledOrders: number;
    guestCount: number;
  };
  series: Array<{ period: string; revenue: number; orders: number }>;
}

export type NotificationType = 'ORDER_READY' | 'ORDER_NEW' | 'BRANCH_ASSIGNMENT' | 'SYSTEM';

export interface NotificationDto {
  id: string;
  branchId: string;
  type: NotificationType;
  title: string;
  body: string;
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ApiErrorDto {
  statusCode: number;
  message: string;
  error?: string;
}
