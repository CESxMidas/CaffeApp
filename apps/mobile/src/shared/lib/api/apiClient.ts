import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_TIMEOUT_MS, resolveApiUrl } from '@shared/config/api.config';
import { loadPersistedSession, saveTokens } from '@shared/lib/storage/tokenStorage';

const API_URL = resolveApiUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;

export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Track refresh state to avoid duplicate refresh calls
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let onLogoutCallback: (() => void) | null = null;

export function setOnLogoutCallback(cb: () => void) {
  onLogoutCallback = cb;
}

async function refreshAccessToken(): Promise<string | null> {
  const session = await loadPersistedSession();
  if (!session?.refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
      refreshToken: session.refreshToken,
    });
    const newAccessToken = response.data.data.accessToken;
    await saveTokens(newAccessToken, session.refreshToken);
    setApiAccessToken(newAccessToken);
    return newAccessToken;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    // 401 → try refresh once, then retry original request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Don't refresh on auth endpoints themselves
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        onLogoutCallback?.();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Deduplicate concurrent refresh calls
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
        });
      }

      const newToken = await refreshPromise;
      if (!newToken) {
        onLogoutCallback?.();
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  },
);

export function getApiBaseUrl(): string {
  return API_URL;
}
