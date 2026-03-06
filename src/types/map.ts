import { z } from 'zod';

// ============================================================================
// Enums — must match the backend Prisma enums exactly
// ============================================================================

export enum LocationType {
  CLASSROOM = 'CLASSROOM',
  OFFICE = 'OFFICE',
  CORRIDOR = 'CORRIDOR',
  LAB = 'LAB',
  THEATER = 'THEATER',
  CONFERENCE = 'CONFERENCE',
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
  CAFETERIA = 'CAFETERIA',
  WAITING_HALL = 'WAITING_HALL',
  ELECTRICAL_ROOM = 'ELECTRICAL_ROOM',
}

// ============================================================================
// Entity interfaces — mirror the backend DTOs
// ============================================================================

export interface Floor {
  id: number;
  building_id: number;
  name: string;
  level: number;
  floor_plan_image_url: string | null;
}

export interface MapNode {
  /** Client-only identifier (UUID) — maps to Location.id after sync */
  id: string;
  name: string;
  room_number: string;
  type: LocationType;
  floor_id: number;
  coordinate_x: number;
  coordinate_y: number;
  is_navigable: boolean;
}

export interface MapEdge {
  /** Client-only identifier */
  id: string;
  source_id: string;
  target_id: string;
  /** Pixel-based Euclidean distance (auto-calculated) */
  distance: number;
  is_accessible: boolean;
}

export interface MapBeacon {
  id: string;
  uuid: string;
  name: string;
  location_id: string | null;
  coordinate_x: number;
  coordinate_y: number;
  floor_id: number;
}

// ============================================================================
// Editor-specific types
// ============================================================================

export type EditorTool = 'select' | 'node' | 'path' | 'beacon' | 'pan';

export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

export interface SelectionState {
  type: 'node' | 'edge' | 'beacon' | null;
  id: string | null;
}

// ============================================================================
// Sync payload — sent to the backend (normalized 0–1 coordinates)
// ============================================================================

export const graphSyncSchema = z.object({
  floor_id: z.number().int().positive(),
  nodes: z.array(
    z.object({
      client_id: z.string().uuid(),
      name: z.string().min(1),
      room_number: z.string().optional(),
      type: z.nativeEnum(LocationType),
      coordinate_x: z.number().min(0).max(1),
      coordinate_y: z.number().min(0).max(1),
    }),
  ),
  edges: z.array(
    z.object({
      client_id: z.string().uuid(),
      source_client_id: z.string().uuid(),
      target_client_id: z.string().uuid(),
      distance: z.number().positive(),
      is_accessible: z.boolean(),
    }),
  ),
  beacons: z.array(
    z.object({
      client_id: z.string().uuid(),
      uuid: z.string(),
      name: z.string(),
      linked_node_client_id: z.string().uuid().optional(),
      coordinate_x: z.number().min(0).max(1),
      coordinate_y: z.number().min(0).max(1),
    }),
  ),
});

export type GraphSyncPayload = z.infer<typeof graphSyncSchema>;
