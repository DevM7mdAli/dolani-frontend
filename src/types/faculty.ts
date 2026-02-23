// ─── Shared Pagination ───────────────────────────────────────────────────────

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginatedMeta;
}

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ProfessorStatus = 'AVAILABLE' | 'NOT_AVAILABLE';

export type DayOfWeek =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export type ReportCategory =
  | 'PROJECTOR'
  | 'SMART_BOARD'
  | 'COMPUTER'
  | 'PRINTER'
  | 'AC'
  | 'LIGHT'
  | 'DOOR'
  | 'PLUG'
  | 'CLEANLINESS'
  | 'SAFETY'
  | 'OTHER';

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Department {
  id: number;
  name: string;
  name_ar?: string;
  type: string;
}

export interface Office {
  id: number;
  name: string;
  room_number: string | null;
  type: string;
}

export interface OfficeHours {
  id: number;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
}

export interface TeachingSlot {
  id: number;
  course_code: string;
  course_name: string;
  course_name_ar?: string;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
  room: string;
  student_count: number;
}

export interface Professor {
  id: number;
  full_name: string;
  email: string;
  status: ProfessorStatus;
  title?: string;
  phone_number: string | null;
  user_id: number;
  department: Department;
  office: Office | null;
  office_hours: OfficeHours[];
}

export interface Report {
  id: number;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  room: string;
  professor_id: number;
  resolved_by_id?: number | null;
  createdAt: string;
  resolved_at?: string | null;
}

export interface ReportStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface UpsertSchedulePayload {
  slots: Omit<TeachingSlot, 'id'>[];
}

export interface CreateReportPayload {
  title: string;
  description: string;
  category: ReportCategory;
  room: string;
}

export interface UpdateReportStatusPayload {
  status: 'IN_PROGRESS' | 'RESOLVED';
  note?: string;
}

export interface ReportListParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  category?: ReportCategory;
  search?: string;
}
