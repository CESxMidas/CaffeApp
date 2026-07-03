import type { BranchDto, ApiDataResponse } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const branchesService = {
  async list(): Promise<BranchDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<BranchDto[]>>(API_ENDPOINTS.branches);
    return data.data;
  },

  async create(dto: { name: string; address?: string; phone?: string }): Promise<BranchDto> {
    const { data } = await apiClient.post<ApiDataResponse<BranchDto>>(API_ENDPOINTS.branches, dto);
    return data.data;
  },

  async update(id: string, dto: { name?: string; address?: string; phone?: string }): Promise<BranchDto> {
    const { data } = await apiClient.patch<ApiDataResponse<BranchDto>>(`${API_ENDPOINTS.branches}/${id}`, dto);
    return data.data;
  },

  async remove(id: string): Promise<BranchDto> {
    const { data } = await apiClient.delete<ApiDataResponse<BranchDto>>(`${API_ENDPOINTS.branches}/${id}`);
    return data.data;
  },
};

export { branchesService as branchService };
