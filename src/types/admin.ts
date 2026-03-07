// ============================================================================
// Location Type Enum — must match backend Prisma enum
// ============================================================================

export enum LocationType {
  CLASSROOM = 'CLASSROOM',
  OFFICE = 'OFFICE',
  LAB = 'LAB',
  CONFERENCE = 'CONFERENCE',
  THEATER = 'THEATER',
  CORRIDOR = 'CORRIDOR',
  EXIT = 'EXIT',
  ELEVATOR = 'ELEVATOR',
  MAIN_HALL = 'MAIN_HALL',
  RESTROOM = 'RESTROOM',
  STAIRS = 'STAIRS',
  SERVICE = 'SERVICE',
  PRAYER_ROOM = 'PRAYER_ROOM',
  SERVER_ROOM = 'SERVER_ROOM',
  STORE_ROOM = 'STORE_ROOM',
  LOCKERS = 'LOCKERS',
}

export type LocationTypeValue = keyof typeof LocationType;

// ============================================================================
// Room Data Type (Frontend Schema)
// ============================================================================

export interface Room {
  id: number | string;
  code: string; // room_number or "Unknown"
  name: string;
  dept: string; // department name or "غير محدد" (Not Assigned)
  floor: number;
  type: string; // Arabic translation
  building: string; // building code
}

// ============================================================================
// Statistics Type
// ============================================================================

export interface RoomStatistics {
  total: number;
  offices: number;
  officesPercentage: number;
  labs: number;
  labsPercentage: number;
  classrooms: number;
  classroomsPercentage: number;
}

// ============================================================================
// Faculty Configuration
// ============================================================================

export const FACULTY_DEPARTMENTS = [
  'Computer Engineering',
  'Computer Science',
  'Network and Communications',
  'Computer Information Systems',
  'Student Affairs',
] as const;

export type FacultyDepartment = (typeof FACULTY_DEPARTMENTS)[number];
