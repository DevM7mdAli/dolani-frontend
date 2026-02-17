'use client';

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  type BuildingResponse,
  type DepartmentResponse,
  type FloorResponse,
  type LocationResponse,
  adminApi,
} from '@/lib/api/admin';

// ============================================================================
// Translations - LocationType enum to Arabic display names
// ============================================================================

type LocationTypeEnum =
  | 'CLASSROOM'
  | 'OFFICE'
  | 'LAB'
  | 'CONFERENCE'
  | 'THEATER'
  | 'CORRIDOR'
  | 'EXIT'
  | 'ELEVATOR'
  | 'MAIN_HALL'
  | 'RESTROOM'
  | 'STAIRS'
  | 'SERVICE'
  | 'PRAYER_ROOM'
  | 'SERVER_ROOM'
  | 'STORE_ROOM'
  | 'LOCKERS';

const LocationTypeTranslations: Record<LocationTypeEnum, string> = {
  CLASSROOM: 'محاضرات',
  OFFICE: 'مكتب',
  LAB: 'معمل',
  CONFERENCE: 'اجتماعات',
  THEATER: 'قاعة',
  CORRIDOR: 'ممر',
  EXIT: 'خروج',
  ELEVATOR: 'مصعد',
  MAIN_HALL: 'قاعة رئيسية',
  RESTROOM: 'دورات مياه',
  STAIRS: 'سلالم',
  SERVICE: 'خدمة',
  PRAYER_ROOM: 'غرفة الصلاة',
  SERVER_ROOM: 'غرفة الخادم',
  STORE_ROOM: 'مستودع',
  LOCKERS: 'خزانات',
};

const RoomStatusTranslations = {
  ACTIVE: 'نشط' as const,
  RESERVED: 'محفوظة' as const,
  OCCUPIED: 'محجوز' as const,
};

/**
 * Get the Arabic name for a LocationType
 */
function getLocationTypeArabicName(type: LocationTypeEnum): string {
  return LocationTypeTranslations[type] || type;
}

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
  status: string; // Always "نشط" (Active) for now
}

// ============================================================================
// Statistics Type
// ============================================================================

export interface RoomStatistics {
  total: number;
  active: number;
  activePercentage: number;
  offices: number;
  officesPercentage: number;
  labs: number;
  labsPercentage: number;
}

// ============================================================================
// Query Keys
// ============================================================================

export const roomQueryKeys = {
  all: ['rooms'] as const,
  list: () => [...roomQueryKeys.all, 'list'] as const,
} as const;

// ============================================================================
// Data Transformation Logic
// ============================================================================

/**
 * Build a map of building ID to Building
 */
function buildBuildingMap(buildings: Awaited<ReturnType<typeof adminApi.getBuildings>>) {
  return new Map(buildings.map((building) => [building.id, building]));
}

/**
 * Build a map of department ID to Department
 */
function buildDepartmentMap(departments: Awaited<ReturnType<typeof adminApi.getDepartments>>) {
  return new Map(departments.map((dept) => [dept.id, dept]));
}

/**
 * Build a map of floor ID to Floor
 */
function buildFloorMap(floors: Awaited<ReturnType<typeof adminApi.getFloors>>) {
  return new Map(floors.map((floor) => [floor.id, floor]));
}

/**
 * Transform location data from backend to frontend Room format
 */
function transformLocationToRoom(
  location: LocationResponse,
  buildingMap: Map<number, BuildingResponse>,
  floorMap: Map<number, FloorResponse>,
  departmentMap: Map<number, DepartmentResponse>,
): Room {
  const floor = floorMap.get(location.floor_id);
  const building = floor ? buildingMap.get(floor.building_id) : null;
  const department = location.department_id ? departmentMap.get(location.department_id) : null;

  return {
    id: location.id,
    code: location.room_number || `Room-${location.id}`,
    name: location.name,
    dept: department?.name || 'غير محدد',
    floor: floor?.floor_number || 0,
    type: getLocationTypeArabicName(location.type as LocationTypeEnum),
    building: building?.code || 'Unknown',
    status: RoomStatusTranslations.ACTIVE, // Default to Active for now
  };
}

/**
 * Calculate statistics from transformed rooms
 */
function calculateStatistics(rooms: Room[]): RoomStatistics {
  const total = rooms.length;
  const active = rooms.filter((r) => r.status === RoomStatusTranslations.ACTIVE).length;
  const offices = rooms.filter((r) => r.type === 'مكتب').length;
  const labs = rooms.filter((r) => r.type === 'معمل').length;

  return {
    total,
    active,
    activePercentage: total > 0 ? Math.round((active / total) * 1000) / 10 : 0,
    offices,
    officesPercentage: total > 0 ? Math.round((offices / total) * 1000) / 10 : 0,
    labs,
    labsPercentage: total > 0 ? Math.round((labs / total) * 1000) / 10 : 0,
  };
}

// ============================================================================
// useRooms Hook
// ============================================================================

export interface UseRoomsOptions {
  enabled?: boolean;
}

export function useRooms(options?: UseRoomsOptions) {
  return useQuery<{ rooms: Room[]; statistics: RoomStatistics }, AxiosError>({
    queryKey: roomQueryKeys.list(),
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    queryFn: async () => {
      try {
        // Fetch all necessary data in parallel
        const [locations, buildings, floors, departments] = await Promise.all([
          adminApi.getLocations(),
          adminApi.getBuildings(),
          adminApi.getFloors(),
          adminApi.getDepartments(),
        ]);

        // Build lookup maps
        const buildingMap = buildBuildingMap(buildings);
        const floorMap = buildFloorMap(floors);
        const departmentMap = buildDepartmentMap(departments);

        // Transform locations to rooms
        const rooms: Room[] = locations.map((location) =>
          transformLocationToRoom(location, buildingMap, floorMap, departmentMap),
        );

        // Calculate statistics
        const statistics = calculateStatistics(rooms);

        return { rooms, statistics };
      } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
      }
    },
  });
}
