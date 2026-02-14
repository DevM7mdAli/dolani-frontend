import { z } from 'zod';

// ============================================================================
// Enums — must match the backend Prisma enums exactly
// ============================================================================

export enum LocationType {
  CLASSROOM = 'CLASSROOM',
  CORRIDOR = 'CORRIDOR',
  ELEVATOR = 'ELEVATOR',
  STAIRS = 'STAIRS',
  RESTROOM = 'RESTROOM',
  EXIT = 'EXIT',
  OFFICE = 'OFFICE',
  LAB = 'LAB',
  AUDITORIUM = 'AUDITORIUM',
  LIBRARY = 'LIBRARY',
  CAFETERIA = 'CAFETERIA',
  OTHER = 'OTHER',
}

// ============================================================================
// Entity interfaces — mirror the backend DTOs
// ============================================================================

export interface Floor {
  id: string;
  building_id: string;
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
  floor_id: string;
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
  floor_id: string;
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
// Sync payload — sent to the backend
// ============================================================================

export const graphSyncSchema = z.object({
  floor_id: z.string().uuid(),
  nodes: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      room_number: z.string(),
      type: z.nativeEnum(LocationType),
      coordinate_x: z.number(),
      coordinate_y: z.number(),
      is_navigable: z.boolean(),
    }),
  ),
  edges: z.array(
    z.object({
      id: z.string().uuid(),
      source_id: z.string().uuid(),
      target_id: z.string().uuid(),
      distance: z.number().positive(),
      is_accessible: z.boolean(),
    }),
  ),
  beacons: z.array(
    z.object({
      id: z.string().uuid(),
      uuid: z.string(),
      name: z.string(),
      location_id: z.string().uuid().nullable(),
      coordinate_x: z.number(),
      coordinate_y: z.number(),
    }),
  ),
});

export type GraphSyncPayload = z.infer<typeof graphSyncSchema>;
