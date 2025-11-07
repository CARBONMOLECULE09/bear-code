export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 30000,
};

export const ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  USERS: {
    PROFILE: '/users/profile',
    STATS: '/users/stats',
    CHANGE_PASSWORD: '/users/change-password',
  },
  CREDITS: {
    BALANCE: '/credits/balance',
    PURCHASE: '/credits/purchase',
    TRANSACTIONS: '/credits/transactions',
  },
  SEARCH: {
    INDEX: '/search/index',
    QUERY: '/search/query',
    DOCUMENTS: '/search/documents',
    HISTORY: '/search/history',
  },
  HEALTH: '/health',
};
