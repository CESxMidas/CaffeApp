import type { ApiDataResponse, BranchOperatorDto, StaffDto, StaffListItemDto, StaffRole } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const staffService = {
  async listBranchOperators(roles?: StaffRole[]): Promise<BranchOperatorDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<BranchOperatorDto[]>>(
      API_ENDPOINTS.staff.branchOperators,
      {
        params: roles?.length ? { role: roles.join(',') } : undefined,
      },
    );
    return data.data;
  },

  async list(): Promise<StaffListItemDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<StaffListItemDto[]>>(
      API_ENDPOINTS.staff.list,
    );
    return data.data;
  },

  async listPendingAssignments(): Promise<StaffListItemDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<StaffListItemDto[]>>(
      API_ENDPOINTS.staff.pendingAssignments,
    );
    return data.data;
  },

  async proposeBranchAssignment(staffId: string, branchId: string): Promise<StaffDto> {
    const { data } = await apiClient.post<ApiDataResponse<StaffDto>>(
      API_ENDPOINTS.staff.propose(staffId),
      { branchId },
    );
    return data.data;
  },

  async approveBranchAssignment(staffId: string): Promise<StaffDto> {
    const { data } = await apiClient.post<ApiDataResponse<StaffDto>>(
      API_ENDPOINTS.staff.approve(staffId),
    );
    return data.data;
  },

  async rejectBranchAssignment(staffId: string): Promise<StaffDto> {
    const { data } = await apiClient.post<ApiDataResponse<StaffDto>>(
      API_ENDPOINTS.staff.reject(staffId),
    );
    return data.data;
  },
};
