import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG, ROUTES } from '../config/api';
import type {
  ApiResponse,
  LoginResponse,
  User,
  CreditTransaction,
  CodeDocument,
  SearchResult,
  SearchQuery,
  UserStats,
  PaginatedResponse,
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private refreshing: boolean = false;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.refreshing) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;
          this.refreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await this.refreshToken(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.refreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post(ROUTES.AUTH.REGISTER, { email, password, name });
    return response.data;
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post(ROUTES.AUTH.LOGIN, { email, password });
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ tokens: any }>> {
    const response = await this.api.post(ROUTES.AUTH.REFRESH, { refreshToken });
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.api.get(ROUTES.USERS.PROFILE);
    return response.data;
  }

  async updateProfile(data: { name?: string; email?: string }): Promise<ApiResponse<User>> {
    const response = await this.api.put(ROUTES.USERS.PROFILE, data);
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.api.post(ROUTES.USERS.CHANGE_PASSWORD, { oldPassword, newPassword });
    return response.data;
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    const response = await this.api.get(ROUTES.USERS.STATS);
    return response.data;
  }

  // Credit endpoints
  async getCreditBalance(): Promise<ApiResponse<{ balance: number }>> {
    const response = await this.api.get(ROUTES.CREDITS.BALANCE);
    return response.data;
  }

  async purchaseCredits(amount: number, paymentMethod: string): Promise<ApiResponse> {
    const response = await this.api.post(ROUTES.CREDITS.PURCHASE, { amount, paymentMethod });
    return response.data;
  }

  async getCreditTransactions(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<CreditTransaction>>> {
    const response = await this.api.get(ROUTES.CREDITS.TRANSACTIONS, { params: { page, limit } });
    return response.data;
  }

  // Search endpoints
  async indexCode(code: string, language: string, metadata?: any): Promise<ApiResponse<CodeDocument>> {
    const response = await this.api.post(ROUTES.SEARCH.INDEX, { code, language, metadata });
    return response.data;
  }

  async searchCode(query: string, limit: number = 10, filters?: any): Promise<ApiResponse<SearchResult[]>> {
    const response = await this.api.post(ROUTES.SEARCH.QUERY, { query, limit, filters });
    return response.data;
  }

  async getDocuments(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<CodeDocument>>> {
    const response = await this.api.get(ROUTES.SEARCH.DOCUMENTS, { params: { page, limit } });
    return response.data;
  }

  async deleteDocument(documentId: string): Promise<ApiResponse> {
    const response = await this.api.delete(`${ROUTES.SEARCH.DOCUMENTS}/${documentId}`);
    return response.data;
  }

  async getSearchHistory(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<SearchQuery>>> {
    const response = await this.api.get(ROUTES.SEARCH.HISTORY, { params: { page, limit } });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response = await this.api.get(ROUTES.HEALTH);
    return response.data;
  }

  // Logout
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
}

export const apiService = new ApiService();
