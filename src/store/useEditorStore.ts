import type {
  EditorTool,
  Floor,
  MapBeacon,
  MapEdge,
  MapNode,
  SelectionState,
  ViewportState,
} from '@/types/map';
import { LocationType } from '@/types/map';
// import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// Helpers
// ============================================================================

function uuid(): string {
  return crypto.randomUUID();
}

function euclidean(
  a: { coordinate_x: number; coordinate_y: number },
  b: { coordinate_x: number; coordinate_y: number },
): number {
  return Math.sqrt(
    Math.pow(a.coordinate_x - b.coordinate_x, 2) + Math.pow(a.coordinate_y - b.coordinate_y, 2),
  );
}

// ============================================================================
// State interface
// ============================================================================

interface EditorState {
  // ----- Data -----
  floor: Floor | null;
  nodes: Record<string, MapNode>;
  edges: Record<string, MapEdge>;
  beacons: Record<string, MapBeacon>;

  // ----- UI -----
  activeTool: EditorTool;
  selection: SelectionState;
  viewport: ViewportState;
  /** When using the "path" tool: first node clicked */
  pathSourceId: string | null;
  isDirty: boolean;
  isLoading: boolean;

  // ----- Floor actions -----
  setFloor: (floor: Floor) => void;

  // ----- Tool actions -----
  setActiveTool: (tool: EditorTool) => void;
  setSelection: (sel: SelectionState) => void;
  clearSelection: () => void;

  // ----- Viewport -----
  setViewport: (vp: Partial<ViewportState>) => void;

  // ----- Node CRUD -----
  addNode: (x: number, y: number, type?: LocationType) => string;
  updateNode: (id: string, partial: Partial<Omit<MapNode, 'id'>>) => void;
  moveNode: (id: string, x: number, y: number) => void;
  removeNode: (id: string) => void;

  // ----- Edge CRUD -----
  startPath: (sourceId: string) => void;
  completePath: (targetId: string) => string | null;
  cancelPath: () => void;
  updateEdge: (id: string, partial: Partial<Omit<MapEdge, 'id'>>) => void;
  removeEdge: (id: string) => void;

  // ----- Beacon CRUD -----
  addBeacon: (x: number, y: number) => string;
  updateBeacon: (id: string, partial: Partial<Omit<MapBeacon, 'id'>>) => void;
  moveBeacon: (id: string, x: number, y: number) => void;
  removeBeacon: (id: string) => void;

  // ----- Image size (for coordinate normalization) -----
  imageSize: { width: number; height: number } | null;
  setImageSize: (width: number, height: number) => void;

  // ----- Bulk -----
  loadGraph: (nodes: MapNode[], edges: MapEdge[], beacons: MapBeacon[]) => void;
  loadGraphFromBackend: (
    data: {
      nodes: {
        id: number;
        name: string;
        room_number: string | null;
        type: string;
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
    },
    imageWidth: number,
    imageHeight: number,
  ) => void;
  markClean: () => void;
  reset: () => void;
}

// ============================================================================
// Initial state
// ============================================================================

const initialState = {
  floor: null as Floor | null,
  nodes: {} as Record<string, MapNode>,
  edges: {} as Record<string, MapEdge>,
  beacons: {} as Record<string, MapBeacon>,
  activeTool: 'select' as EditorTool,
  selection: { type: null, id: null } as SelectionState,
  viewport: { x: 0, y: 0, scale: 1 },
  pathSourceId: null as string | null,
  isDirty: false,
  isLoading: false,
  imageSize: null as { width: number; height: number } | null,
};

// ============================================================================
// Store
// ============================================================================

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    ...initialState,

    // ----- Floor -----
    setFloor: (floor) =>
      set((s) => {
        s.floor = floor;
      }),

    // ----- Tools -----
    setActiveTool: (tool) =>
      set((s) => {
        s.activeTool = tool;
        s.pathSourceId = null; // reset in-progress path
      }),

    setSelection: (sel) =>
      set((s) => {
        s.selection = sel;
      }),

    clearSelection: () =>
      set((s) => {
        s.selection = { type: null, id: null };
      }),

    // ----- Viewport -----
    setViewport: (vp) =>
      set((s) => {
        Object.assign(s.viewport, vp);
      }),

    // ----- Nodes -----
    addNode: (x, y, type = LocationType.CORRIDOR) => {
      const id = uuid();
      const floorId = get().floor?.id ?? 0;
      set((s) => {
        s.nodes[id] = {
          id,
          name: '',
          room_number: '',
          type,
          floor_id: floorId,
          coordinate_x: x,
          coordinate_y: y,
          is_navigable: true,
          department_id: null,
        };
        s.isDirty = true;
        s.selection = { type: 'node', id };
      });
      return id;
    },

    updateNode: (id, partial) =>
      set((s) => {
        if (s.nodes[id]) {
          Object.assign(s.nodes[id], partial);
          s.isDirty = true;
        }
      }),

    moveNode: (id, x, y) =>
      set((s) => {
        const node = s.nodes[id];
        if (!node) return;

        node.coordinate_x = x;
        node.coordinate_y = y;
        s.isDirty = true;

        // Recalculate edges touching this node
        for (const edge of Object.values(s.edges)) {
          if (edge.source_id === id || edge.target_id === id) {
            const src = s.nodes[edge.source_id];
            const tgt = s.nodes[edge.target_id];
            if (src && tgt) {
              edge.distance = euclidean(src, tgt);
            }
          }
        }
      }),

    removeNode: (id) =>
      set((s) => {
        delete s.nodes[id];
        // Remove connected edges
        for (const [eid, edge] of Object.entries(s.edges)) {
          if (edge.source_id === id || edge.target_id === id) {
            delete s.edges[eid];
          }
        }
        // Unlink beacons
        for (const beacon of Object.values(s.beacons)) {
          if (beacon.location_id === id) {
            beacon.location_id = null;
          }
        }
        if (s.selection.id === id) {
          s.selection = { type: null, id: null };
        }
        s.isDirty = true;
      }),

    // ----- Edges (Paths) -----
    startPath: (sourceId) =>
      set((s) => {
        s.pathSourceId = sourceId;
      }),

    completePath: (targetId) => {
      const { pathSourceId, nodes, edges } = get();
      if (!pathSourceId || pathSourceId === targetId) {
        set((s) => {
          s.pathSourceId = null;
        });
        return null;
      }

      // Prevent duplicate edges
      const exists = Object.values(edges).some(
        (e) =>
          (e.source_id === pathSourceId && e.target_id === targetId) ||
          (e.source_id === targetId && e.target_id === pathSourceId),
      );
      if (exists) {
        set((s) => {
          s.pathSourceId = null;
        });
        return null;
      }

      const src = nodes[pathSourceId];
      const tgt = nodes[targetId];
      if (!src || !tgt) {
        set((s) => {
          s.pathSourceId = null;
        });
        return null;
      }

      const id = uuid();
      set((s) => {
        s.edges[id] = {
          id,
          source_id: pathSourceId,
          target_id: targetId,
          distance: euclidean(src, tgt),
          is_accessible: true,
        };
        s.pathSourceId = null;
        s.isDirty = true;
        s.selection = { type: 'edge', id };
      });
      return id;
    },

    cancelPath: () =>
      set((s) => {
        s.pathSourceId = null;
      }),

    updateEdge: (id, partial) =>
      set((s) => {
        if (s.edges[id]) {
          Object.assign(s.edges[id], partial);
          s.isDirty = true;
        }
      }),

    removeEdge: (id) =>
      set((s) => {
        delete s.edges[id];
        if (s.selection.id === id) {
          s.selection = { type: null, id: null };
        }
        s.isDirty = true;
      }),

    // ----- Beacons -----
    addBeacon: (x, y) => {
      const id = uuid();
      const floorId = get().floor?.id ?? 0;
      set((s) => {
        s.beacons[id] = {
          id,
          uuid: '',
          name: '',
          location_id: null,
          coordinate_x: x,
          coordinate_y: y,
          floor_id: floorId,
        };
        s.isDirty = true;
        s.selection = { type: 'beacon', id };
      });
      return id;
    },

    updateBeacon: (id, partial) =>
      set((s) => {
        if (s.beacons[id]) {
          Object.assign(s.beacons[id], partial);
          s.isDirty = true;
        }
      }),

    moveBeacon: (id, x, y) =>
      set((s) => {
        const beacon = s.beacons[id];
        if (beacon) {
          beacon.coordinate_x = x;
          beacon.coordinate_y = y;
          s.isDirty = true;
        }
      }),

    removeBeacon: (id) =>
      set((s) => {
        delete s.beacons[id];
        if (s.selection.id === id) {
          s.selection = { type: null, id: null };
        }
        s.isDirty = true;
      }),

    // ----- Bulk -----
    loadGraph: (nodes, edges, beacons) =>
      set((s) => {
        s.nodes = {};
        s.edges = {};
        s.beacons = {};
        for (const n of nodes) s.nodes[n.id] = n;
        for (const e of edges) s.edges[e.id] = e;
        for (const b of beacons) s.beacons[b.id] = b;
        s.isDirty = false;
        s.isLoading = false;
      }),

    loadGraphFromBackend: (data, imageWidth, imageHeight) =>
      set((s) => {
        const maxDim = Math.max(imageWidth, imageHeight);
        const floorId = s.floor?.id ?? 0;

        // Server ID → client UUID mapping for edge/beacon references
        const serverToClient = new Map<number, string>();

        s.nodes = {};
        for (const n of data.nodes) {
          const clientId = uuid();
          serverToClient.set(n.id, clientId);
          s.nodes[clientId] = {
            id: clientId,
            name: n.name,
            room_number: n.room_number ?? '',
            type: n.type as LocationType,
            floor_id: floorId,
            coordinate_x: n.coordinate_x * imageWidth,
            coordinate_y: n.coordinate_y * imageHeight,
            is_navigable: true,
            department_id: n.department_id ?? null,
          };
        }

        s.edges = {};
        for (const e of data.edges) {
          const srcId = serverToClient.get(e.start_location_id);
          const tgtId = serverToClient.get(e.end_location_id);
          if (!srcId || !tgtId) continue;
          const clientId = uuid();
          s.edges[clientId] = {
            id: clientId,
            source_id: srcId,
            target_id: tgtId,
            distance: e.distance * maxDim,
            is_accessible: e.is_accessible,
          };
        }

        s.beacons = {};
        for (const b of data.beacons) {
          const linkedId = serverToClient.get(b.location_id) ?? null;
          const clientId = uuid();
          s.beacons[clientId] = {
            id: clientId,
            uuid: b.uuid,
            name: b.name ?? '',
            location_id: linkedId,
            coordinate_x: b.coordinate_x * imageWidth,
            coordinate_y: b.coordinate_y * imageHeight,
            floor_id: floorId,
          };
        }

        s.isDirty = false;
        s.isLoading = false;
      }),

    markClean: () =>
      set((s) => {
        s.isDirty = false;
      }),

    setImageSize: (width, height) =>
      set((s) => {
        s.imageSize = { width, height };
      }),

    reset: () => set(() => ({ ...initialState })),
  })),
);
