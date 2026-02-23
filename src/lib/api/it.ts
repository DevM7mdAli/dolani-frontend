import type {
  Paginated,
  Report,
  ReportListParams,
  ReportStats,
  UpdateReportStatusPayload,
} from '@/types/faculty';

import apiClient from '@/lib/axios';

export const itApi = {
  // ── Reports ────────────────────────────────────────────────────────────────

  getReportStats: async (): Promise<ReportStats> => {
    const { data } = await apiClient.get<ReportStats>('it/reports/stats');
    return data;
  },

  getAllReports: async (params: ReportListParams = {}): Promise<Paginated<Report>> => {
    const { data } = await apiClient.get<Paginated<Report>>('it/reports', { params });
    return data;
  },

  getReportById: async (id: number): Promise<Report> => {
    const { data } = await apiClient.get<Report>(`it/reports/${id}`);
    return data;
  },

  updateReportStatus: async (id: number, payload: UpdateReportStatusPayload): Promise<Report> => {
    const { data } = await apiClient.patch<Report>(`it/reports/${id}/status`, payload);
    return data;
  },
} as const;
