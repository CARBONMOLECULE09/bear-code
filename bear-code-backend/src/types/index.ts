export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  credits: number;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  credits: number;
  role: string;
  createdAt: Date;
}

export interface CreditTransaction {
  _id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  operation?: string;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface CodeDocument {
  _id: string;
  userId: string;
  code: string;
  language: string;
  metadata: {
    fileName?: string;
    filePath?: string;
    projectName?: string;
    tags?: string[];
    [key: string]: any;
  };
  vectorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchQuery {
  userId: string;
  query: string;
  filters?: Record<string, any>;
  limit?: number;
  results?: number;
  creditsUsed: number;
  createdAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
