import type {
  ApiDataResponse,
  ChangePasswordCodeResponseDto,
  ConfirmChangePasswordRequestDto,
  ChangePasswordRequestDto,
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

  async requestPasswordChangeCode(
    payload: ChangePasswordRequestDto,
  ): Promise<ChangePasswordCodeResponseDto> {
    const { data } = await apiClient.post<ApiDataResponse<ChangePasswordCodeResponseDto>>(
      API_ENDPOINTS.auth.changePassword,
      payload,
    );
    return data.data;
  },

  async confirmPasswordChange(payload: ConfirmChangePasswordRequestDto): Promise<void> {
    await apiClient.post<ApiDataResponse<{ ok: true }>>(
      API_ENDPOINTS.auth.confirmChangePassword,
      payload,
    );
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiDataResponse<{ ok: true }>>(API_ENDPOINTS.auth.logout);
  },
};
