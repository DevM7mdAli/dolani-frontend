import type {
  CreateReportPayload,
  Paginated,
  Professor,
  ProfessorStatus,
  Report,
  ReportListParams,
  TeachingSlot,
  UpsertSchedulePayload,
} from '@/types/faculty';

import apiClient from '@/lib/axios';

export const facultyApi = {
  // ── Profile ──────────────────────────────────────────────────────────────

  getMyProfile: async (): Promise<Professor> => {
    const { data } = await apiClient.get<Professor>('faculty/profile');
    return data;
  },

  updateStatus: async (status: ProfessorStatus): Promise<Professor> => {
    const { data } = await apiClient.patch<Professor>('faculty/status', { status });
    return data;
  },

  updateOfficeHours: async (
    officeHours: { day: string; start_time: string; end_time: string }[],
  ): Promise<Professor> => {
    const { data } = await apiClient.patch<Professor>('faculty/office-hours', { officeHours });
    return data;
  },

  // ── Schedule ─────────────────────────────────────────────────────────────

  getSchedule: async (): Promise<TeachingSlot[]> => {
    const { data } = await apiClient.get<TeachingSlot[]>('faculty/schedule');
    return data;
  },

  upsertSchedule: async (payload: UpsertSchedulePayload): Promise<TeachingSlot[]> => {
    const { data } = await apiClient.put<TeachingSlot[]>('faculty/schedule', payload);
    return data;
  },

  // ── Reports ───────────────────────────────────────────────────────────────

  getMyReports: async (params: ReportListParams = {}): Promise<Paginated<Report>> => {
    const { data } = await apiClient.get<Paginated<Report>>('faculty/reports', { params });
    return data;
  },

  createReport: async (payload: CreateReportPayload): Promise<Report> => {
    const { data } = await apiClient.post<Report>('faculty/reports', payload);
    return data;
  },
} as const;
