import type { ApiDataResponse, ShiftDto, ShiftReconciliationDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const shiftService = {
  async list(branchId?: string): Promise<ShiftDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<ShiftDto[]>>(API_ENDPOINTS.shifts, {
      params: { ...(branchId ? { branchId } : {}) },
    });
    return data.data;
  },

  async getActive(branchId?: string): Promise<ShiftDto | null> {
    const { data } = await apiClient.get<ApiDataResponse<ShiftDto | null>>(
      `${API_ENDPOINTS.shifts}/active`,
      { params: { ...(branchId ? { branchId } : {}) } },
    );
    return data.data;
  },

  async open(payload: {
    branchId: string;
    name: string;
    shiftType: string;
    startTime: string;
    endTime: string;
  }): Promise<ShiftDto> {
    const { data } = await apiClient.post<ApiDataResponse<ShiftDto>>(
      `${API_ENDPOINTS.shifts}/open`,
      payload,
    );
    return data.data;
  },

  async getReconciliation(shiftId: string): Promise<ShiftReconciliationDto> {
    const { data } = await apiClient.get<ApiDataResponse<ShiftReconciliationDto>>(
      `${API_ENDPOINTS.shifts}/${shiftId}/reconciliation`,
    );
    return data.data;
  },

  async close(shiftId: string): Promise<ShiftDto> {
    const { data } = await apiClient.post<ApiDataResponse<ShiftDto>>(
      `${API_ENDPOINTS.shifts}/close`,
      { shiftId },
    );
    return data.data;
  },
};
