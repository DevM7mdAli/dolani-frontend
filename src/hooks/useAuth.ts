import { useAuthStore } from '@/store/useAuthStore';
import type { AuthError, AuthResponse, LoginFormValues } from '@/types/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { authApi } from '@/lib/api/auth';

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
} as const;

/**
 * Login mutation hook.
 * Handles login API call, stores tokens & user in zustand, and
 * invalidates any stale auth queries.
 */
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError<AuthError>, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

/**
 * Logout mutation hook.
 * Calls backend logout, clears zustand store, and resets all queries.
 */
export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<AuthError>>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: () => {
      // Even if the API call fails, clear local state
      clearAuth();
      queryClient.clear();
    },
  });
}
