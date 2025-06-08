import { apiClient, isAuthenticated, clearAuthData } from '../../app/services/api';

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('Authentication', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'agent',
          },
          tokens: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            expiresAt: Date.now() + 3600000,
          },
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe('test@example.com');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'authTokens',
        JSON.stringify(mockResponse.data.tokens)
      );
    });

    it('should handle login failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          message: 'Invalid credentials',
        }),
      });

      const result = await apiClient.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should register successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'agent',
          },
          tokens: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            expiresAt: Date.now() + 3600000,
          },
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.register({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data?.user.name).toBe('Test User');
    });

    it('should verify OTP successfully', async () => {
      const mockResponse = {
        success: true,
        data: { verified: true },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.verifyOTP('+1234567890', '123456');

      expect(result.success).toBe(true);
      expect(result.data?.verified).toBe(true);
    });

    it('should logout successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await apiClient.logout();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('authTokens');
    });
  });

  describe('Data Operations', () => {
    beforeEach(() => {
      // Mock authenticated state
      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({
          accessToken: 'valid-token',
          refreshToken: 'refresh-token',
          expiresAt: Date.now() + 3600000,
        })
      );
    });

    it('should fetch leads successfully', async () => {
      const mockLeads = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          status: 'new',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockLeads }),
      });

      const result = await apiClient.getLeads();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLeads);
    });

    it('should create lead successfully', async () => {
      const newLead = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567891',
        status: 'new' as const,
      };

      const mockResponse = {
        success: true,
        data: { ...newLead, id: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.createLead(newLead);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Jane Doe');
    });

    it('should update lead successfully', async () => {
      const updateData = { status: 'contacted' as const };
      const mockResponse = {
        success: true,
        data: { id: '1', ...updateData },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.updateLead('1', updateData);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('contacted');
    });

    it('should fetch commissions successfully', async () => {
      const mockCommissions = [
        {
          id: '1',
          clientName: 'John Doe',
          packageType: 'Premium',
          commissionAmount: 500,
          status: 'paid',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCommissions }),
      });

      const result = await apiClient.getCommissions();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCommissions);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await apiClient.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle timeout errors', async () => {
      (fetch as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => {
          // Simulate timeout
          setTimeout(() => {
            const error = new Error('Request timeout');
            error.name = 'AbortError';
            throw error;
          }, 100);
        })
      );

      const result = await apiClient.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Utility Functions', () => {
    it('should check authentication status correctly', async () => {
      // Test authenticated state
      mockAsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify({
          accessToken: 'valid-token',
          refreshToken: 'refresh-token',
          expiresAt: Date.now() + 3600000, // Future date
        })
      );

      const authenticated = await isAuthenticated();
      expect(authenticated).toBe(true);

      // Test expired token
      mockAsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify({
          accessToken: 'expired-token',
          refreshToken: 'refresh-token',
          expiresAt: Date.now() - 3600000, // Past date
        })
      );

      const notAuthenticated = await isAuthenticated();
      expect(notAuthenticated).toBe(false);
    });

    it('should clear auth data correctly', async () => {
      await clearAuthData();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('authTokens');
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('userData');
    });
  });
});
