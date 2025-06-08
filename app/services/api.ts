// API Service Layer for Affiliate Agent App
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

const API_TIMEOUT = 10000; // 10 seconds

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'agent' | 'admin';
  referralCode?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  clientName: string;
  packageType: string;
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'paid' | 'pending' | 'processing';
  createdAt: string;
  paymentDate?: string;
  transactionId?: string;
}

// HTTP Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const tokens = await AsyncStorage.getItem('authTokens');
      if (tokens) {
        const { accessToken, expiresAt }: AuthTokens = JSON.parse(tokens);
        if (Date.now() < expiresAt) {
          return accessToken;
        }
        // Token expired, try to refresh
        await this.refreshToken();
        const newTokens = await AsyncStorage.getItem('authTokens');
        if (newTokens) {
          const { accessToken: newAccessToken }: AuthTokens = JSON.parse(newTokens);
          return newAccessToken;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const tokens = await AsyncStorage.getItem('authTokens');
      if (tokens) {
        const { refreshToken }: AuthTokens = JSON.parse(tokens);
        const response = await this.request('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
        
        if (response.success && response.data) {
          await this.saveTokens(response.data);
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.clearTokens();
    }
  }

  private async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.setItem('authTokens', JSON.stringify(tokens));
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authTokens');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const token = await this.getAuthToken();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error: any) {
      console.error('API Request Error:', error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
        };
      }

      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await this.request<{ user: User; tokens: AuthTokens }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      await this.saveTokens(response.data.tokens);
    }

    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await this.request<{ user: User; tokens: AuthTokens }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      await this.saveTokens(response.data.tokens);
    }

    return response;
  }

  async verifyOTP(phone: string, otp: string): Promise<ApiResponse<{ verified: boolean }>> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  }

  async resendOTP(phone: string): Promise<ApiResponse<{ sent: boolean }>> {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearTokens();
    }
  }

  // User methods
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/user/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Leads methods
  async getLeads(): Promise<ApiResponse<Lead[]>> {
    return this.request('/leads');
  }

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lead>> {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async updateLead(id: string, leadData: Partial<Lead>): Promise<ApiResponse<Lead>> {
    return this.request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  }

  // Commission methods
  async getCommissions(): Promise<ApiResponse<Commission[]>> {
    return this.request('/commissions');
  }

  async getCommissionSummary(): Promise<ApiResponse<any>> {
    return this.request('/commissions/summary');
  }

  // Promotional content methods
  async getPromotionalContent(): Promise<ApiResponse<any[]>> {
    return this.request('/promotional-content');
  }

  async createPromotionalContent(content: any): Promise<ApiResponse<any>> {
    return this.request('/promotional-content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async updatePromotionalContent(id: string, content: any): Promise<ApiResponse<any>> {
    return this.request(`/promotional-content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  async deletePromotionalContent(id: string): Promise<ApiResponse<void>> {
    return this.request(`/promotional-content/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const tokens = await AsyncStorage.getItem('authTokens');
    if (tokens) {
      const { expiresAt }: AuthTokens = JSON.parse(tokens);
      return Date.now() < expiresAt;
    }
    return false;
  } catch {
    return false;
  }
};

export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authTokens');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};
