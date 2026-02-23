import type {
  CreateReportPayload,
  Paginated,
  Professor,
  Report,
  ReportListParams,
  TeachingSlot,
  UpsertSchedulePayload,
} from '@/types/faculty';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { toast } from 'sonner';

import { facultyApi } from '@/lib/api/faculty';

// ─── Query Key Factory ───────────────────────────────────────────────────────

export const facultyKeys = {
  all: ['faculty'] as const,
  profile: () => [...facultyKeys.all, 'profile'] as const,
  schedule: () => [...facultyKeys.all, 'schedule'] as const,
  reports: (params: ReportListParams = {}) => [...facultyKeys.all, 'reports', params] as const,
} as const;

// ─── Profile ─────────────────────────────────────────────────────────────────

export function useMyProfile() {
  return useQuery<Professor, AxiosError>({
    queryKey: facultyKeys.profile(),
    queryFn: facultyApi.getMyProfile,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export function useSchedule() {
  return useQuery<TeachingSlot[], AxiosError>({
    queryKey: facultyKeys.schedule(),
    queryFn: facultyApi.getSchedule,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpsertSchedule() {
  const queryClient = useQueryClient();

  return useMutation<TeachingSlot[], AxiosError, UpsertSchedulePayload>({
    mutationFn: facultyApi.upsertSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.schedule() });
      toast.success('Schedule saved successfully');
    },
    onError: () => {
      toast.error('Failed to save schedule. Please try again.');
    },
  });
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export function useMyReports(params: ReportListParams = {}) {
  return useQuery<Paginated<Report>, AxiosError>({
    queryKey: facultyKeys.reports(params),
    queryFn: () => facultyApi.getMyReports(params),
    staleTime: 60 * 1000,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation<Report, AxiosError, CreateReportPayload>({
    mutationFn: facultyApi.createReport,
    onSuccess: () => {
      // Invalidate all report queries regardless of filter params
      queryClient.invalidateQueries({ queryKey: [...facultyKeys.all, 'reports'] });
      toast.success('Report submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit report. Please try again.');
    },
  });
}
