import type { CreateOrderDto, OrderDto, UpdateOrderStatusDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const orderService = {
  async listOrders(branchId: string): Promise<OrderDto[]> {
    const { data } = await apiClient.get<OrderDto[]>(API_ENDPOINTS.orders, {
      params: { branchId },
    });
    return data;
  },

  async getOrder(orderId: string): Promise<OrderDto> {
    const { data } = await apiClient.get<OrderDto>(`${API_ENDPOINTS.orders}/${orderId}`);
    return data;
  },

  async createOrder(payload: CreateOrderDto): Promise<OrderDto> {
    const { data } = await apiClient.post<OrderDto>(API_ENDPOINTS.orders, payload);
    return data;
  },

  async updateStatus(orderId: string, payload: UpdateOrderStatusDto): Promise<OrderDto> {
    const { data } = await apiClient.patch<OrderDto>(
      `${API_ENDPOINTS.orders}/${orderId}/status`,
      payload,
    );
    return data;
  },
};
