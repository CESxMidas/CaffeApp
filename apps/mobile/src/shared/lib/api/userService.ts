import type { ApiDataResponse, UserDto, StaffDto } from '@caffeapp/shared';
import { apiClient } from './apiClient';

export interface CreateUserRequest {
  email: string;
  fullName: string;
  password: string;
  role: string;
  branchId?: string;
  phone?: string;
}

export interface CreatedUserResponse {
  user: UserDto;
  staff: StaffDto;
}

export const userService = {
  async create(dto: CreateUserRequest): Promise<CreatedUserResponse> {
    const { data } = await apiClient.post<ApiDataResponse<CreatedUserResponse>>(
      '/api/v1/users',
      dto,
    );
    return data.data;
  },
};
