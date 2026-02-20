export type ProfessorStatus = 'AVAILABLE' | 'NOT_AVAILABLE';

export type DayOfWeek =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface OfficeHours {
  id: number;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
}

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
  full_name_ar?: string;
  email: string;
  status: ProfessorStatus;
  title?: string;
  title_ar?: string;
  user_id: number;
  department: Department;
  office: Office | null;
  office_hours: OfficeHours[];
}

export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export type ReportCategory = 'MAINTENANCE' | 'EQUIPMENT' | 'SAFETY' | 'CLEANLINESS' | 'OTHER';

export interface Report {
  id: number;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  room: string;
  created_at: string;
  resolved_at?: string;
}
