import { Platform } from 'react-native';

export const API_TIMEOUT_MS = 15_000;

/** True when URL targets device/emulator LAN, not usable from desktop browser. */
function isDeviceOnlyApiUrl(url: string): boolean {
  return (
    url.includes('10.0.2.2') ||
    /\/\/192\.168\.\d+\.\d+/.test(url) ||
    /\/\/172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+/.test(url) ||
    /\/\/10\.\d+\.\d+\.\d+/.test(url)
  );
}

/** Resolve API base URL per platform (10.0.2.2 is Android-emulator-only). */
export function resolveApiUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

  // Expo web chạy trên localhost — dùng API local dù .env ghi IP LAN cho Expo Go
  if (Platform.OS === 'web') {
    if (!configured || isDeviceOnlyApiUrl(configured)) {
      return 'http://localhost:3000';
    }
    return configured;
  }

  if (Platform.OS === 'android' && configured?.includes('localhost')) {
    return configured.replace('localhost', '10.0.2.2');
  }

  return configured ?? 'http://localhost:3000';
}

export const API_ENDPOINTS = {
  health: '/api/v1/health',
  auth: {
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
    me: '/api/v1/auth/me',
  },
  branches: '/api/v1/branches',
  tables: '/api/v1/tables',
  products: '/api/v1/products',
  orders: '/api/v1/orders',
  payments: '/api/v1/payments',
  reports: '/api/v1/reports',
  notifications: '/api/v1/notifications',
  staff: {
    list: '/api/v1/staff',
    pendingAssignments: '/api/v1/staff/branch-assignments/pending',
    propose: (staffId: string) => `/api/v1/staff/${staffId}/branch-assignment`,
    approve: (staffId: string) => `/api/v1/staff/${staffId}/branch-assignment/approve`,
    reject: (staffId: string) => `/api/v1/staff/${staffId}/branch-assignment/reject`,
  },
} as const;
