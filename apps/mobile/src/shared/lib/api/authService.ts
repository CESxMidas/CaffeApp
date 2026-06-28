import type {
  ApiDataResponse,
  LoginRequestDto,
  LoginResponseDto,
  MeResponseDto,
} from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const authService = {
  async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
    const { data } = await apiClient.post<ApiDataResponse<LoginResponseDto>>(
      API_ENDPOINTS.auth.login,
      payload,
    );
    return data.data;
  },

  async getMe(): Promise<MeResponseDto> {
    const { data } = await apiClient.get<ApiDataResponse<MeResponseDto>>(API_ENDPOINTS.auth.me);
    return data.data;
  },
};
