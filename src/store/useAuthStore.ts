import type { AuthResponse, AuthUser } from '@/types/auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  // State
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (response: AuthResponse) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Set full auth state after login
      setAuth: (response: AuthResponse) => {
        // Store tokens in cookies for middleware access
        if (typeof document !== 'undefined') {
          document.cookie = `accessToken=${response.access_token}; path=/; max-age=${15 * 60}`;
          document.cookie = `refreshToken=${response.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
          document.cookie = `userRole=${response.user.role}; path=/;`;
        }

        set({
          user: response.user,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
        });
      },

      // Update tokens after refresh (preserves user)
      updateTokens: (accessToken: string, refreshToken: string) => {
        if (typeof document !== 'undefined') {
          document.cookie = `accessToken=${accessToken}; path=/; max-age=${15 * 60}`;
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }

        set({
          accessToken,
          refreshToken,
        });
      },

      // Clear all auth state on logout
      clearAuth: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=; path=/; max-age=0';
          document.cookie = 'refreshToken=; path=/; max-age=0';
          document.cookie = 'userRole=; path=/; max-age=0';
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'dolani-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
