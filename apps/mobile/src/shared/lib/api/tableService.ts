import type { TableDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const tableService = {
  async listTables(branchId: string): Promise<TableDto[]> {
    const { data } = await apiClient.get<TableDto[]>(API_ENDPOINTS.tables, {
      params: { branchId },
    });
    return data;
  },

  async getTable(tableId: string): Promise<TableDto> {
    const { data } = await apiClient.get<TableDto>(`${API_ENDPOINTS.tables}/${tableId}`);
    return data;
  },
};
