import type { ApiDataResponse, TableDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const tableService = {
  async listTables(branchId?: string): Promise<TableDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<TableDto[]>>(API_ENDPOINTS.tables, {
      params: branchId ? { branchId } : undefined,
    });
    return data.data;
  },
};
