import { env } from '@/env';
import axios, { AxiosError, AxiosInstance } from 'axios';

// Singleton instance
const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    // Component for future token logic (localStorage, cookies, session)
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`[API Error] ${status}:`, data);

      // Handle 401 Unauthorized globally if needed
      // if (status === 401) {
      //   // Redirect to login or refresh token
      // }
    } else {
      console.error('[API Error] Network/Unknown:', error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
