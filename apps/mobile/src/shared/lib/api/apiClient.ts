import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_TIMEOUT_MS, resolveApiUrl } from '@shared/config/api.config';

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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Sprint 1: global 401 handler + token refresh
    return Promise.reject(error);
  },
);

export function getApiBaseUrl(): string {
  return API_URL;
}
