'use client';

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { type DepartmentResponse, adminApi } from '@/lib/api/admin';

export const departmentQueryKeys = {
  all: ['departments'] as const,
  list: () => [...departmentQueryKeys.all, 'list'] as const,
} as const;

export function useDepartments() {
  return useQuery<DepartmentResponse[], AxiosError>({
    queryKey: departmentQueryKeys.list(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    queryFn: async () => {
      return adminApi.getDepartments();
    },
  });
}
