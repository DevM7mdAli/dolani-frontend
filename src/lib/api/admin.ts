import type { GraphSyncPayload } from '@/types/map';

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
    | 'LOCKERS'
    | 'CAFETERIA'
    | 'WAITING_HALL'
    | 'ELECTRICAL_ROOM';
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

export interface ProfessorResponse {
  id: number;
  full_name: string;
  email: string;
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  phone_number: string | null;
  show_phone: boolean;
  user_id: number;
  location_id: number | null;
  department_id: number;
  office?: { name: string; room_number: string | null };
  department: DepartmentResponse;
  office_hours?: Array<{
    id: number;
    day: string;
    start_time: string;
    end_time: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateLocationRequest {
  name: string;
  room_number: string;
  type: LocationResponse['type'];
  floor_id: number;
  department_id?: number | null;
  coordinate_x?: number;
  coordinate_y?: number;
}

export interface BeaconResponse {
  id: number;
  uuid: string;
  name: string | null;
  operating: boolean;
  signal_count: number;
  coordinate_x: number;
  coordinate_y: number;
  location_id: number;
  floor_id: number;
  department_id: number | null;
  location?: LocationResponse;
  floor?: FloorResponse;
  department?: DepartmentResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeaconRequest {
  uuid: string;
  name?: string;
  operating?: boolean;
  location_id: number;
  floor_id: number;
  department_id?: number;
  coordinate_x: number;
  coordinate_y: number;
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
    const PAGE_LIMIT = 100; // max allowed by backend DTO
    let page = 1;
    let totalPages = 1;
    const all: LocationResponse[] = [];

    do {
      const params: Record<string, unknown> = { limit: PAGE_LIMIT, page };
      if (floorId) params.floorId = floorId;

      const response = await apiClient.get<
        { data: LocationResponse[]; meta: { totalPages: number } } | LocationResponse[]
      >('/admin/locations', { params });

      const raw = response.data;
      if (Array.isArray(raw)) {
        // Bare array — no pagination
        return raw;
      }
      all.push(...raw.data);
      totalPages = raw.meta.totalPages;
      page++;
    } while (page <= totalPages);

    return all;
  },

  /**
   * Get paginated locations (rooms) with optional filters
   * @param page - Page number (default 1)
   * @param limit - Items per page (default 9)
   * @param floorId - Optional floor ID filter
   * @param departmentId - Optional department ID filter
   * @param type - Optional location type filter
   * @param search - Optional search query
   * @returns Paginated list of locations
   */
  getLocationsPaginated: async (
    page: number = 1,
    limit: number = 9,
    floorId?: number,
    departmentId?: number,
    type?: string,
    search?: string,
  ): Promise<PaginatedResponse<LocationResponse>> => {
    const params: Record<string, unknown> = { page, limit };
    if (floorId) params.floorId = floorId;
    if (departmentId) params.departmentId = departmentId;
    if (type) params.type = type;
    if (search) params.search = search;

    const response = await apiClient.get<PaginatedResponse<LocationResponse>>('/admin/locations', {
      params,
    });
    return response.data;
  },

  /**
   * Create a new location (room)
   * @param data - Location creation data
   * @returns Created location
   */
  createLocation: async (data: CreateLocationRequest): Promise<LocationResponse> => {
    const response = await apiClient.post<LocationResponse>('/admin/locations', data);
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

  /**
   * Get all professors with pagination and optional filters
   * @param page - Page number (default 1)
   * @param limit - Items per page (default 6)
   * @param departmentId - Optional department ID filter
   * @param status - Optional status filter (AVAILABLE or NOT_AVAILABLE)
   * @param search - Optional search query (searches full_name, email, etc)
   * @returns Paginated list of professors
   */
  getProfessors: async (
    page: number = 1,
    limit: number = 6,
    departmentId?: number,
    status?: 'AVAILABLE' | 'NOT_AVAILABLE',
    search?: string,
  ): Promise<PaginatedResponse<ProfessorResponse>> => {
    const params: Record<string, unknown> = { page, limit };
    if (departmentId) params.departmentId = departmentId;
    if (status) params.status = status;
    if (search) params.search = search;

    const response = await apiClient.get<PaginatedResponse<ProfessorResponse>>('/faculty', {
      params,
    });
    return response.data;
  },

  /**
   * Create a new professor
   * @param data - Professor creation data
   * @returns Created professor
   */
  createProfessor: async (data: {
    full_name: string;
    email: string;
    department_id: number;
    phone_number?: string;
    show_phone?: boolean;
    location_id?: number | null;
  }): Promise<ProfessorResponse> => {
    const response = await apiClient.post<ProfessorResponse>('/faculty', data);
    return response.data;
  },

  /**
   * Update an existing professor
   * @param professorId - ID of professor to update
   * @param data - Partial professor data to update
   * @returns Updated professor
   */
  updateProfessor: async (
    professorId: number,
    data: Partial<{
      full_name: string;
      email: string;
      department_id: number;
      phone_number?: string;
      show_phone?: boolean;
      location_id?: number | null;
    }>,
  ): Promise<ProfessorResponse> => {
    const response = await apiClient.patch<ProfessorResponse>(`/faculty/${professorId}`, data);
    return response.data;
  },

  /**
   * Delete a professor
   * @param professorId - ID of professor to delete
   * @returns Deletion confirmation message
   */
  deleteProfessor: async (professorId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/faculty/${professorId}`);
    return response.data;
  },

  /**
   * Update an existing location (room)
   * @param locationId - ID of the location to update
   * @param data - Partial location data to update
   * @returns Updated location
   */
  updateLocation: async (
    locationId: number | string,
    data: Partial<CreateLocationRequest>,
  ): Promise<LocationResponse> => {
    const response = await apiClient.patch<LocationResponse>(
      `/admin/locations/${locationId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a location (room)
   * @param locationId - ID of the location to delete
   * @returns Success response
   */
  deleteLocation: async (locationId: number | string): Promise<void> => {
    await apiClient.delete(`/admin/locations/${locationId}`);
  },

  getGraph: async (
    floorId: number,
  ): Promise<{
    nodes: {
      id: number;
      name: string;
      room_number: string | null;
      type: LocationResponse['type'];
      coordinate_x: number;
      coordinate_y: number;
      department_id: number | null;
    }[];
    edges: {
      id: number;
      start_location_id: number;
      end_location_id: number;
      distance: number;
      is_accessible: boolean;
    }[];
    beacons: {
      id: number;
      uuid: string;
      name: string | null;
      location_id: number;
      coordinate_x: number;
      coordinate_y: number;
    }[];
  }> => {
    const response = await apiClient.get(`/admin/graph/${floorId}`);
    return response.data;
  },

  syncGraph: async (payload: GraphSyncPayload): Promise<{ idMap: Record<string, number> }> => {
    const response = await apiClient.post<{ idMap: Record<string, number> }>(
      '/admin/graph/sync',
      payload,
    );
    return response.data;
  },

  /**
   * Get all beacons with optional location filter
   * @param locationId - Optional location ID to filter by
   * @returns Array of beacons with related location, floor, and department data
   */
  getBeacons: async (locationId?: number): Promise<BeaconResponse[]> => {
    const PAGE_LIMIT = 100;
    let page = 1;
    let totalPages = 1;
    const all: BeaconResponse[] = [];

    do {
      const params: Record<string, unknown> = { limit: PAGE_LIMIT, page };
      if (locationId) params.locationId = locationId;

      const response = await apiClient.get<
        { data: BeaconResponse[]; meta: { totalPages: number } } | BeaconResponse[]
      >('/admin/beacons', { params });

      const raw = response.data;
      if (Array.isArray(raw)) {
        return raw;
      }
      all.push(...raw.data);
      totalPages = raw.meta.totalPages;
      page++;
    } while (page <= totalPages);

    return all;
  },

  /**
   * Create a new beacon
   * @param data - Beacon creation data
   * @returns Created beacon
   */
  createBeacon: async (data: CreateBeaconRequest): Promise<BeaconResponse> => {
    const response = await apiClient.post<BeaconResponse>('/admin/beacons', data);
    return response.data;
  },

  /**
   * Update an existing beacon
   * @param beaconId - ID of the beacon to update
   * @param data - Partial beacon data to update
   * @returns Updated beacon
   */
  updateBeacon: async (
    beaconId: number,
    data: Partial<CreateBeaconRequest>,
  ): Promise<BeaconResponse> => {
    const response = await apiClient.patch<BeaconResponse>(`/admin/beacons/${beaconId}`, data);
    return response.data;
  },

  /**
   * Delete a beacon
   * @param beaconId - ID of beacon to delete
   * @returns Success response
   */
  deleteBeacon: async (beaconId: number): Promise<void> => {
    await apiClient.delete(`/admin/beacons/${beaconId}`);
  },
} as const;
