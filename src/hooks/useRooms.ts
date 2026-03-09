'use client';

import type { Room, RoomStatistics } from '@/types/admin';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  type BuildingResponse,
  type DepartmentResponse,
  type FloorResponse,
  type LocationResponse,
  adminApi,
} from '../lib/api/admin';

// ============================================================================
// Re-exports for convenience
// ============================================================================

export type { Room, RoomStatistics } from '@/types/admin';

// ============================================================================
// Query Keys
// ============================================================================

export const roomQueryKeys = {
  all: ['rooms'] as const,
  list: () => [...roomQueryKeys.all, 'list'] as const,
  paginated: (
    page?: number,
    limit?: number,
    departmentId?: number,
    type?: string,
    search?: string,
  ) => [...roomQueryKeys.all, 'paginated', { page, limit, departmentId, type, search }] as const,
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
  displayMap: Record<string, string>,
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
    type: displayMap[location.type] || location.type,
    building: building?.code || 'Unknown',
  };
}

/**
 * Calculate statistics from transformed rooms
 */
function calculateStatistics(rooms: Room[]): RoomStatistics {
  const total = rooms.length;
  const offices = rooms.filter((r) => r.type === 'Office').length;
  const labs = rooms.filter((r) => r.type === 'Lab').length;
  const classrooms = rooms.filter((r) => r.type === 'Classrooms').length;

  return {
    total,
    offices,
    officesPercentage: total > 0 ? Math.round((offices / total) * 1000) / 10 : 0,
    labs,
    labsPercentage: total > 0 ? Math.round((labs / total) * 1000) / 10 : 0,
    classrooms,
    classroomsPercentage: total > 0 ? Math.round((classrooms / total) * 1000) / 10 : 0,
  };
}

// ============================================================================
// useRooms Hook
// ============================================================================

export interface UseRoomsOptions {
  enabled?: boolean;
  displayMap?: Record<string, string>;
}

export interface UseRoomsPaginatedOptions {
  page?: number;
  limit?: number;
  departmentId?: number;
  type?: string;
  search?: string;
  enabled?: boolean;
  displayMap?: Record<string, string>;
}

export function useRooms(options?: UseRoomsOptions) {
  const displayMap = options?.displayMap || {};

  return useQuery<{ rooms: Room[]; statistics: RoomStatistics }, AxiosError>({
    queryKey: roomQueryKeys.list(),
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    queryFn: async () => {
      try {
        // Fetch all necessary data in parallel
        const [rawLocations, rawBuildings, rawFloors, rawDepartments] = await Promise.all([
          adminApi.getLocations(),
          adminApi.getBuildings(),
          adminApi.getFloors(),
          adminApi.getDepartments(),
        ]);

        // API methods already return typed arrays directly
        const locations = rawLocations as LocationResponse[];
        const buildings = rawBuildings as BuildingResponse[];
        const floors = rawFloors as FloorResponse[];
        const departments = rawDepartments as DepartmentResponse[];

        // Build lookup maps
        const buildingMap = buildBuildingMap(buildings);
        const floorMap = buildFloorMap(floors);
        const departmentMap = buildDepartmentMap(departments);

        // Transform locations to rooms
        const rooms: Room[] = locations.map((location) =>
          transformLocationToRoom(location, buildingMap, floorMap, departmentMap, displayMap),
        );

        // Calculate statistics
        const statistics = calculateStatistics(rooms);

        return { rooms, statistics };
      } catch (err) {
        console.error('Error fetching rooms:', err);
        throw err;
      }
    },
  });
}

/**
 * Hook for paginated rooms data
 */
export function useRoomsPaginated(options: UseRoomsPaginatedOptions = {}) {
  const {
    page = 1,
    limit = 9,
    departmentId,
    type,
    search,
    enabled = true,
    displayMap = {},
  } = options;

  return useQuery<
    { rooms: Room[]; statistics: RoomStatistics; meta: { totalPages: number; total: number } },
    AxiosError
  >({
    queryKey: roomQueryKeys.paginated(page, limit, departmentId, type, search),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    queryFn: async () => {
      try {
        // Fetch paginated locations and all necessary data in parallel
        const [paginatedData, rawBuildings, rawFloors, rawDepartments, allLocations] =
          await Promise.all([
            adminApi.getLocationsPaginated(page, limit, undefined, departmentId, type, search),
            adminApi.getBuildings(),
            adminApi.getFloors(),
            adminApi.getDepartments(),
            adminApi.getLocations(), // For statistics
          ]);

        const buildings = rawBuildings as BuildingResponse[];
        const floors = rawFloors as FloorResponse[];
        const departments = rawDepartments as DepartmentResponse[];

        // Build lookup maps
        const buildingMap = buildBuildingMap(buildings);
        const floorMap = buildFloorMap(floors);
        const departmentMap = buildDepartmentMap(departments);

        // Transform paginated locations to rooms
        const rooms: Room[] = paginatedData.data.map((location) =>
          transformLocationToRoom(location, buildingMap, floorMap, departmentMap, displayMap),
        );

        // Calculate statistics from all locations (not just current page)
        const allRooms: Room[] = (allLocations as LocationResponse[]).map((location) =>
          transformLocationToRoom(location, buildingMap, floorMap, departmentMap, displayMap),
        );
        const statistics = calculateStatistics(allRooms);

        return {
          rooms,
          statistics,
          meta: {
            totalPages: paginatedData.meta.totalPages,
            total: paginatedData.meta.total,
          },
        };
      } catch (err) {
        console.error('Error fetching paginated rooms:', err);
        throw err;
      }
    },
  });
}
