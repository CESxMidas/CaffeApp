export const API_TIMEOUT_MS = 15_000;

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
} as const;
