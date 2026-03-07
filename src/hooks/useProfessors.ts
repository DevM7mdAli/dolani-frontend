'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { type PaginatedResponse, type ProfessorResponse, adminApi } from '@/lib/api/admin';

// ─── Query Key Factory ───────────────────────────────────────────────────────

export const professorQueryKeys = {
  all: ['professors'] as const,
  list: (page?: number, limit?: number, departmentId?: number, status?: string, search?: string) =>
    [...professorQueryKeys.all, 'list', { page, limit, departmentId, status, search }] as const,
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CreateProfessorData {
  full_name: string;
  email: string;
  department_id: number;
  phone_number?: string;
  location_id?: number | null;
}

export interface UpdateProfessorData extends Partial<CreateProfessorData> {
  id: number;
}

interface UseAdminProfessorsOptions {
  page?: number;
  limit?: number;
  departmentId?: number;
  status?: 'AVAILABLE' | 'NOT_AVAILABLE';
  search?: string;
  enabled?: boolean;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useAdminProfessors(options: UseAdminProfessorsOptions = {}) {
  const { page = 1, limit = 6, departmentId, status, search, enabled = true } = options;

  return useQuery<PaginatedResponse<ProfessorResponse>, AxiosError>({
    queryKey: professorQueryKeys.list(page, limit, departmentId, status, search),
    queryFn: () => adminApi.getProfessors(page, limit, departmentId, status, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    enabled,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateProfessor() {
  const queryClient = useQueryClient();

  return useMutation<ProfessorResponse, AxiosError, CreateProfessorData>({
    mutationFn: async (data) => {
      const response = await adminApi.createProfessor(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorQueryKeys.all });
    },
  });
}

export function useUpdateProfessor() {
  const queryClient = useQueryClient();

  return useMutation<
    ProfessorResponse,
    AxiosError,
    { id: number; data: Partial<CreateProfessorData> }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await adminApi.updateProfessor(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorQueryKeys.all });
    },
  });
}

export function useDeleteProfessor() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, AxiosError, number>({
    mutationFn: async (id) => {
      const response = await adminApi.deleteProfessor(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorQueryKeys.all });
    },
  });
}
