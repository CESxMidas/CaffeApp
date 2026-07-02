import type { ApiDataResponse, RevenueReportDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const reportService = {
  async getRevenue(params: {
    from: string;
    to: string;
    branchId?: string;
    shiftId?: string;
  }): Promise<RevenueReportDto> {
    const { data } = await apiClient.get<ApiDataResponse<RevenueReportDto>>(
      `${API_ENDPOINTS.reports}/revenue`,
      { params },
    );
    return data.data;
  },

  async getHourlyRevenue(params: {
    branchId?: string;
    date?: string;
  }): Promise<{ hour: number; revenue: number; orders: number }[]> {
    const { data } = await apiClient.get<
      ApiDataResponse<{ hour: number; revenue: number; orders: number }[]>
    >(`${API_ENDPOINTS.orders}/stats/hourly`, { params });
    return data.data;
  },
};
