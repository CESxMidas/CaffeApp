import type { ApiDataResponse, NotificationDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const notificationService = {
  async list(): Promise<NotificationDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<NotificationDto[]>>(
      API_ENDPOINTS.notifications,
    );
    return data.data;
  },

  async unreadCount(): Promise<number> {
    const { data } = await apiClient.get<ApiDataResponse<{ count: number }>>(
      `${API_ENDPOINTS.notifications}/unread-count`,
    );
    return data.data.count;
  },

  async markRead(id: string): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.notifications}/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.notifications}/read-all`);
  },
};
