import type {
  ReportListParams,
  ReportStats,
  ReportWithRelations,
  UpdateReportStatusPayload,
} from '@/types/faculty';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';

import { itApi } from '@/lib/api/it';

// ─── Query Key Factory ───────────────────────────────────────────────────────

export const itKeys = {
  all: ['it'] as const,
  stats: () => [...itKeys.all, 'stats'] as const,
  reports: (params: ReportListParams = {}) => [...itKeys.all, 'reports', params] as const,
  report: (id: number) => [...itKeys.all, 'reports', id] as const,
} as const;

// ─── Stats ───────────────────────────────────────────────────────────────────

export function useReportStats() {
  return useQuery<ReportStats, AxiosError>({
    queryKey: itKeys.stats(),
    queryFn: itApi.getReportStats,
    staleTime: 30 * 1000,
  });
}

// ─── Reports List ─────────────────────────────────────────────────────────────

export function useAllReports(params: ReportListParams = {}) {
  return useQuery({
    queryKey: itKeys.reports(params),
    queryFn: () => itApi.getAllReports(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

// ─── Report Detail ────────────────────────────────────────────────────────────

export function useReportDetail(id: number) {
  return useQuery<ReportWithRelations, AxiosError>({
    queryKey: itKeys.report(id),
    queryFn: () => itApi.getReportById(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}

// ─── Update Status ────────────────────────────────────────────────────────────

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    ReportWithRelations,
    AxiosError,
    { id: number; payload: UpdateReportStatusPayload }
  >({
    mutationFn: ({ id, payload }) =>
      itApi.updateReportStatus(id, payload) as Promise<ReportWithRelations>,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: itKeys.stats() });
      queryClient.invalidateQueries({ queryKey: [...itKeys.all, 'reports'] });
      queryClient.invalidateQueries({ queryKey: itKeys.report(id) });
    },
  });
}
