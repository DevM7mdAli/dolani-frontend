import type { Professor, ProfessorStatus } from '@/types/faculty';

import apiClient from '@/lib/axios';

export const facultyApi = {
  getMyProfile: async (): Promise<Professor> => {
    const response = await apiClient.get<Professor>('faculty/profile');
    return response.data;
  },

  updateStatus: async (status: ProfessorStatus): Promise<Professor> => {
    const response = await apiClient.patch<Professor>('faculty/status', { status });
    return response.data;
  },

  updateOfficeHours: async (
    officeHours: { day: string; start_time: string; end_time: string }[],
  ): Promise<Professor> => {
    const response = await apiClient.patch<Professor>('faculty/office-hours', { officeHours });
    return response.data;
  },
} as const;
