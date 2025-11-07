export interface User {
  _id: string;
  email: string;
  name: string;
  credits: number;
  role: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
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
  createdAt: string;
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
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  code: string;
  language: string;
  metadata: Record<string, any>;
  score: number;
}

export interface SearchQuery {
  userId: string;
  query: string;
  filters?: Record<string, any>;
  limit?: number;
  results?: number;
  creditsUsed: number;
  createdAt: string;
}

export interface UserStats {
  totalSearches: number;
  totalDocuments: number;
  totalCreditsUsed: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
