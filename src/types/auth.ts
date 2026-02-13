import { z } from 'zod';

// ============================================================================
// Schemas (used for form validation)
// ============================================================================

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required').max(255, 'Identifier is too long'),
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================================================
// API Response Types (mirrors backend AuthResponse)
// ============================================================================

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  name: string;
  role: 'ADMIN' | 'FACULTY';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface AuthError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
