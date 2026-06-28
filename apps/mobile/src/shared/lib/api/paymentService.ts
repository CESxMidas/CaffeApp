import type { ApiDataResponse, CreatePaymentDto, PaymentDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const paymentService = {
  async createPayment(payload: CreatePaymentDto): Promise<PaymentDto> {
    const { data } = await apiClient.post<ApiDataResponse<PaymentDto>>(
      API_ENDPOINTS.payments,
      payload,
    );
    return data.data;
  },
};
