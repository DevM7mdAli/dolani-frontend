import type { AuthResponse, LoginFormValues } from '@/types/auth';

import apiClient from '@/lib/axios';

export const authApi = {
  login: async (data: LoginFormValues): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getProfile: async () => {
    const response = await apiClient.get<{
      id: number;
      email: string;
      username: string;
      role: string;
    }>('/auth/profile');
    return response.data;
  },
} as const;
