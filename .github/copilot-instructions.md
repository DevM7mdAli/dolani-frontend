# Dolani Frontend Agent Instructions (Next.js)

You are an Expert Frontend Architect specializing in\*\* \*\* **Next.js** ,\*\* \*\* **Canvas Graphics** , and\*\* \*\* **Complex State Management** . You are building the** \*\***Web Application Subsystem\*\* for "Dolani".

## 💻 Tech Stack & Libraries

- **Framework:** Next.js 15 (App Router).
- **UI System:** Shadcn UI + Tailwind CSS.
- **State Management:** **Zustand** (Crucial for the Map Editor global state).
- **Graphics/Map Engine:** **`react-konva`** (HTML5 Canvas wrapper) for high-performance rendering of floor plans, nodes, and connections.
- **Data Fetching:** TanStack Query (v5) + Axios.
- **Forms:** React Hook Form + Zod (Schema validation must match Backend DTOs).

## 🔑 Core Subsystems

### 1. The Map Editor (`/dashboard/admin/map-editor`)

**Objective:** A CAD-like interface to convert physical floor plan images into the digital Graph (Nodes & Edges) required by the backend's A\* algorithm.

- **Visual Layers:**
  - **Layer 1 (Background):** The\*\* **`Floor` plan image (fetched via** \*\*`floor_plan_image_url`). Support Pan & Zoom interactions.
  - **Layer 2 (Edges/Paths):** Lines connecting nodes. Color-coded by status (e.g., yellow for valid, red for disconnected).
  - **Layer 3 (Nodes/Locations):** Draggable circles representing\*\* **`Locations`. Icons must change based on** **`Location.type` (e.g., Door icon for** **`EXIT`, Desk for** \*\*`OFFICE`).
  - **Layer 4 (Beacons):** Distinct markers (e.g., Bluetooth symbol) representing\*\* \*\*`Beacon` hardware positions.
- **Editor Tools (Toolbar):**
  - **Select Tool:** Click to edit properties, Drag to move\*\* \*\*`coordinate_x`/`coordinate_y`.
  - **Node Tool:** Click empty space to create a\*\* \*\*`Location`.
    - _Input:_ Must select Type (Enum:\*\* **`CLASSROOM`,** **`CORRIDOR`,** \*\*`ELEVATOR`, etc.) to match Backend Enum.
  - **Path Tool:** Click Node A → Click Node B to create a\*\* \*\*`Path` connection.
    - _Logic:_ Auto-calculate Euclidean distance (pixels) to pre-fill the\*\* \*\*`distance` field.
  - **Beacon Tool:** Drop a beacon marker.
    - _Input:_ Must map to a\*\* \*\*`Beacon` entity (UUID, Name).
- **Data Synchronization:**
  - **Coordinate System:** Maps canvas pixel coordinates\*\* **(**x**,**y**)** **directly to the Backend** \*\*`Location` float fields.
  - **Save Logic:** "Atomic Save" button. Sends the current state of Nodes and Edges to\*\* \*\*`POST /admin/graph/sync` (or individual endpoints).

### 2. Admin Dashboard (`/dashboard/admin`)

- **Room Management:** Data Table (Shadcn) for\*\* \*\*`Locations`.
  - _Columns:_ Name, Room Number, Type, Floor.
- **Faculty Management:**
  - Create\*\* **`User` (Role: FACULTY) → Then Create** \*\*`Professor` profile.
  - Assign Professor to a\*\* **`Department` and an** \*\*`Office` (Location ID).

### 3. Faculty Portal (`/dashboard/doctors`)

- **Status Toggle:**
  - Three-state switch:\*\* \*\* **Available (Green)** ,\*\* \*\* **Busy (Red)** ,\*\* \*\* **Away (Grey)** .
  - Updates the\*\* \*\*`Professor.status` field in real-time.
- **Office Hours Scheduler:**
  - A weekly grid (Sunday-Thursday).
  - Click-and-drag to set time slots.
  - Saves to\*\* **`OfficeHours` entity (`day`,** **`start_time`,** \*\*`end_time`).

## 🎨 Design & Behavior Standards

- **Theme:** "Academic Professional" (Teal\*\* \*\*`#008080`, Yellow accents).
- **Localization:** **MANDATORY** Bi-directional support.
  - English (LTR) and Arabic (RTL).
  - Editor canvas controls (Toolbar) must flip position in RTL mode.
- **Performance:**
  - The Map Editor must handle 500+ nodes without lag. Use\*\* \*\*`react-konva` caching strategies.
  - Debounce coordinate updates when dragging nodes.

## 📂 Folder Structure Standards

```
src/
├── app/
│   ├── dashboard/
│   │   ├── (admin)/
│   │   │   ├── map-editor/    # The Canvas Editor Page
│   │   │   ├── rooms/         # Data Tables
│   │   │   └── layout.tsx     # Admin Sidebar
│   │   └── (doctors)/         # Faculty Portal
├── components/
│   ├── map-editor/            # Konva Components
│   │   ├── CanvasStage.tsx    # Main Stage
│   │   ├── NodeLayer.tsx      # Renders Location circles
│   │   ├── ConnectionLayer.tsx# Renders Path lines
│   │   └── EditorToolbar.tsx  # Tools (Select, Draw, etc.)
│   └── ui/                    # Shadcn primitives
├── lib/
│   ├── store/
│   │   └── useEditorStore.ts  # Zustand store for Graph State
│   └── api/                   # Typed Axios functions
└── types/                     # TS Interfaces (Match Backend Prisma)
```

## 🛡️ Senior Implementation Guidelines

1. **Strict Typing:** Export interfaces that strictly match the Backend DTOs.
   - _Example:_ `LocationType` must exactly match the Prisma Enum.
2. **State Isolation:** Keep the** \*\***Map Editor State** (Zustand) separate from** \***\*Server State** (React Query). Only sync when the user hits "Save" or "Load".
3. **Coordinate Normalization:** If possible, store coordinates as percentages (0.0 to 1.0) relative to image size to handle responsive resizing, OR enforce a fixed aspect ratio matching the\*\* \*\*`Floor` image resolution.
4. **Error Handling:** If a fetch fails (e.g., "Floor plan not found"), display a Shadcn\*\* \*\*`Toast` with the error message.
