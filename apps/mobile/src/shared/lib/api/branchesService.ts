import type { BranchDto, ApiDataResponse } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const branchesService = {
  async list(): Promise<BranchDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<BranchDto[]>>(API_ENDPOINTS.branches);
    return data.data;
  },
};
