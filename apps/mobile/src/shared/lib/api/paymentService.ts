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

  async getByOrder(orderId: string): Promise<PaymentDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<PaymentDto[]>>(
      `${API_ENDPOINTS.payments}/by-order/${orderId}`,
    );
    return data.data;
  },

  async verifyPayment(paymentId: string, notes?: string): Promise<PaymentDto> {
    const { data } = await apiClient.post<ApiDataResponse<PaymentDto>>(
      `${API_ENDPOINTS.payments}/${paymentId}/verify`,
      { verified: true, ...(notes ? { notes } : {}) },
    );
    return data.data;
  },

  async voidPayment(params: {
    paymentId: string;
    reason: string;
    actedByStaffId?: string;
  }): Promise<{ orderId: string }> {
    const { data } = await apiClient.post<ApiDataResponse<{ orderId: string }>>(
      `${API_ENDPOINTS.payments}/${params.paymentId}/void`,
      { reason: params.reason, actedByStaffId: params.actedByStaffId },
    );
    return data.data;
  },
};
