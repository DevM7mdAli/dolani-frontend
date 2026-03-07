'use client';

import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { type LocationResponse, adminApi } from '@/lib/api/admin';

export const locationQueryKeys = {
  all: ['locations'] as const,
  list: (floorId?: number) => [...locationQueryKeys.all, 'list', { floorId }] as const,
} as const;

export function useLocations(floorId?: number) {
  return useQuery<LocationResponse[], AxiosError>({
    queryKey: locationQueryKeys.list(floorId),
    queryFn: () => adminApi.getLocations(floorId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
