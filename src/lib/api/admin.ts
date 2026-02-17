import apiClient from '@/lib/axios';

// ============================================================================
// Types for API Responses
// ============================================================================

export interface LocationResponse {
  id: number;
  type:
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
  name: string;
  room_number: string | null;
  coordinate_x: number;
  coordinate_y: number;
  floor_id: number;
  department_id: number | null;
  floor: FloorResponse;
  department: DepartmentResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface FloorResponse {
  id: number;
  floor_number: number;
  floor_plan_image_url: string | null;
  building_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface BuildingResponse {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentResponse {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Admin API Endpoints
// ============================================================================

export const adminApi = {
  /**
   * Get all locations (rooms) with optional floor filter
   * @param floorId - Optional floor ID to filter by
   * @returns Array of locations with related floor and department data
   */
  getLocations: async (floorId?: number): Promise<LocationResponse[]> => {
    const params = floorId ? { floorId } : {};
    const response = await apiClient.get<LocationResponse[]>('/admin/locations', { params });
    return response.data;
  },

  /**
   * Get all buildings
   * @returns Array of all buildings
   */
  getBuildings: async (): Promise<BuildingResponse[]> => {
    const response = await apiClient.get<BuildingResponse[]>('/admin/buildings');
    return response.data;
  },

  /**
   * Get all floors with optional building filter
   * @param buildingId - Optional building ID to filter by
   * @returns Array of floors with building relationship
   */
  getFloors: async (buildingId?: number): Promise<FloorResponse[]> => {
    const params = buildingId ? { buildingId } : {};
    const response = await apiClient.get<FloorResponse[]>('/admin/floors', { params });
    return response.data;
  },

  /**
   * Get all departments
   * @returns Array of all departments
   */
  getDepartments: async (): Promise<DepartmentResponse[]> => {
    const response = await apiClient.get<DepartmentResponse[]>('/admin/departments');
    return response.data;
  },
} as const;
