import type { ApiDataResponse, RevenueReportDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const reportService = {
  async getRevenue(params: {
    from: string;
    to: string;
    branchId?: string;
  }): Promise<RevenueReportDto> {
    const { data } = await apiClient.get<ApiDataResponse<RevenueReportDto>>(
      `${API_ENDPOINTS.reports}/revenue`,
      { params },
    );
    return data.data;
  },
};
