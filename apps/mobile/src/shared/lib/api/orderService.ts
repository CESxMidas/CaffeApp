import type {
  ApiDataResponse,
  CreateOrderDto,
  DeliverOrderRequestDto,
  OrderDto,
  UpdateOrderStatusDto,
} from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const orderService = {
  async listOrders(
    branchId?: string,
    status?: string,
    tableId?: string,
    deliveryState?: 'awaiting_delivery' | 'awaiting_payment',
  ): Promise<OrderDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<OrderDto[]>>(API_ENDPOINTS.orders, {
      params: {
        ...(branchId ? { branchId } : {}),
        ...(status ? { status } : {}),
        ...(tableId ? { tableId } : {}),
        ...(deliveryState ? { deliveryState } : {}),
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

  async updateStatus(orderId: string, body: UpdateOrderStatusDto): Promise<OrderDto> {
    const { data } = await apiClient.patch<ApiDataResponse<OrderDto>>(
      `${API_ENDPOINTS.orders}/${orderId}/status`,
      body,
    );
    return data.data;
  },

  async deliver(orderId: string, body: DeliverOrderRequestDto = {}): Promise<OrderDto> {
    const { data } = await apiClient.post<ApiDataResponse<OrderDto>>(
      `${API_ENDPOINTS.orders}/${orderId}/deliver`,
      body,
    );
    return data.data;
  },
};
