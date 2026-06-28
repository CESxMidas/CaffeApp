import type {
  ApiDataResponse,
  CreateOrderDto,
  OrderDto,
  OrderStatus,
  UpdateOrderStatusDto,
} from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const orderService = {
  async listOrders(branchId?: string, status?: string): Promise<OrderDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<OrderDto[]>>(API_ENDPOINTS.orders, {
      params: {
        ...(branchId ? { branchId } : {}),
        ...(status ? { status } : {}),
      },
    });
    return data.data;
  },

  async getOrder(orderId: string): Promise<OrderDto> {
    const { data } = await apiClient.get<ApiDataResponse<OrderDto>>(
      `${API_ENDPOINTS.orders}/${orderId}`,
    );
    return data.data;
  },

  async createOrder(payload: CreateOrderDto): Promise<OrderDto> {
    const { data } = await apiClient.post<ApiDataResponse<OrderDto>>(API_ENDPOINTS.orders, payload);
    return data.data;
  },

  async updateStatus(orderId: string, status: OrderStatus): Promise<OrderDto> {
    const body: UpdateOrderStatusDto = { status };
    const { data } = await apiClient.patch<ApiDataResponse<OrderDto>>(
      `${API_ENDPOINTS.orders}/${orderId}/status`,
      body,
    );
    return data.data;
  },
};
