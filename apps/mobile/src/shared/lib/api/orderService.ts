import type {
  ApiDataResponse,
  CreateOrderDto,
  DeliverOrderRequestDto,
  MergeOrdersDto,
  OrderDto,
  SplitOrderDto,
  SplitOrderResponseDto,
  TransferOrderTableDto,
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

  async transferTable(orderId: string, body: TransferOrderTableDto): Promise<OrderDto> {
    const { data } = await apiClient.patch<ApiDataResponse<OrderDto>>(
      `${API_ENDPOINTS.orders}/${orderId}/table`,
      body,
    );
    return data.data;
  },

  async mergeOrders(body: MergeOrdersDto): Promise<OrderDto> {
    const { data } = await apiClient.post<ApiDataResponse<OrderDto>>(
      `${API_ENDPOINTS.orders}/merge`,
      body,
    );
    return data.data;
  },

  async splitOrder(orderId: string, body: SplitOrderDto): Promise<SplitOrderResponseDto> {
    const { data } = await apiClient.post<ApiDataResponse<SplitOrderResponseDto>>(
      `${API_ENDPOINTS.orders}/${orderId}/split`,
      body,
    );
    return data.data;
  },

  async toggleItemPrepared(
    orderId: string,
    itemId: string,
    isPrepared: boolean,
  ): Promise<OrderDto> {
    const { data } = await apiClient.patch<ApiDataResponse<OrderDto>>(
      `${API_ENDPOINTS.orders}/${orderId}/items/${itemId}/prepared`,
      { isPrepared },
    );
    return data.data;
  },
};
