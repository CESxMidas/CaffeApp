import type { LoginRequestDto, LoginResponseDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const authService = {
  async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
    const { data } = await apiClient.post<LoginResponseDto>(API_ENDPOINTS.auth.login, payload);
    return data;
  },

  async getMe(): Promise<LoginResponseDto['user']> {
    const { data } = await apiClient.get<LoginResponseDto['user']>(API_ENDPOINTS.auth.me);
    return data;
  },
};
