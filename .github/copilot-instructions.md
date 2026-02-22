# Dolani Frontend Agent Instructions

You are an Expert Frontend Architect specializing in **Next.js 15**, **Canvas Graphics**, and **Complex State Management**. You are building the **Web Application Subsystem & Landing Page** for "Dolani" (an indoor navigation platform).

## 💻 Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router).
- **Dual Backend Consumption:**
  1. **NestJS REST API (Core App):** Handles all business logic, A\* routing graph, user authentication, and dashboard data.
  2. **Payload CMS v3.x (Marketing Only):** A headless CMS restricted _strictly_ to serving content for the public landing page.
- **UI System:** Shadcn UI + Tailwind CSS.
- **State Management:** **Zustand** (Crucial for the Map Editor global state).
- **Graphics/Map Engine:** **`react-konva`** (HTML5 Canvas wrapper) for high-performance rendering of floor plans, nodes, and connections.
- **Data Fetching:** TanStack Query (v5) + Axios.
- **Forms & Validation:** React Hook Form + Zod.

## 🔑 Core Subsystems

### 1. Public Landing Page (`/`)

**Objective:** High-conversion marketing page.

- **Data Source:** Fetches SEO metadata, copy, and images strictly from **Payload CMS**.

### 2. The Map Editor (`/dashboard/admin/map-editor`)

**Objective:** A CAD-like interface to convert physical floor plan images into the digital Graph (Nodes & Edges) required by the NestJS A\* algorithm.

- **Visual Layers:**
  - **Layer 1 (Background):** The `Floor` plan image. Support Pan & Zoom interactions.
  - **Layer 2 (Edges/Paths):** Lines connecting nodes. Color-coded by status (e.g., valid vs. disconnected).
  - **Layer 3 (Nodes/Locations):** Draggable circles representing `Locations`. Icons must change based on `Location.type` (e.g., Door icon for `EXIT`).
  - **Layer 4 (Beacons):** Distinct markers representing Bluetooth `Beacon` hardware positions.
- **Editor Tools (Toolbar):**
  - **Select Tool:** Click to edit properties, Drag to update coordinates.
  - **Node Tool:** Click empty space to create a `Location`. (Must select Type from NestJS Enum).
  - **Path Tool:** Click Node A → Click Node B to create a `Path` connection. Auto-calculate Euclidean distance (pixels).
- **Data Synchronization:**
  - Maps canvas pixel coordinates **(x, y)** directly to the NestJS `Location` float fields.
  - **Save Logic:** "Atomic Save" button. Sends the current state to the NestJS API (`POST /admin/graph/sync`).

### 3. Admin Dashboard (`/dashboard/admin`)

**Objective:** Standard facility and user management communicating with NestJS.

- **Room Management:** Data Table (Shadcn) for `Locations` (Name, Room Number, Type, Floor).
- **Faculty Management:** Create Users, assign Professors to Departments and Offices.

### 4. Faculty Portal (`/dashboard/doctors`)

**Objective:** Self-service portal for faculty/doctors.

- **Status Toggle:** Three-state switch (Available, Busy, Away) that PATCHes the NestJS backend.
- **Office Hours Scheduler:** A weekly grid to set time slots, saving to the NestJS `OfficeHours` endpoints.

## 🎨 Design & Behavior Standards

- **Theme:** "Academic Professional" (Teal `#008080`, Yellow accents).
- **Localization:** **MANDATORY** Bi-directional support (English LTR and Arabic RTL). Editor canvas controls must flip position in RTL mode.
- **Performance:**
  - The Map Editor must handle 500+ nodes without lag using `react-konva` caching strategies.
  - Debounce coordinate updates when dragging nodes.

## 📂 Folder Structure Standards

```text
src/
├── app/
│   ├── (marketing)/           # Landing Page (Payload CMS Driven)
│   │   ├── page.tsx
│   │   └── layout.tsx         # Public Header/Footer
│   ├── dashboard/             # Core App (NestJS Driven)
│   │   ├── (admin)/
│   │   │   ├── map-editor/    # The Canvas Editor Page
│   │   │   └── rooms/
│   │   ├── (doctors)/         # Faculty Portal
│   │   └── layout.tsx         # Dashboard Sidebar/Auth Wrapper
├── components/
│   ├── map-editor/            # Konva Components
│   │   ├── CanvasStage.tsx
│   │   ├── NodeLayer.tsx
│   │   └── EditorToolbar.tsx
│   └── ui/                    # Shadcn primitives
├── lib/
│   ├── store/
│   │   └── useEditorStore.ts  # Zustand store for Graph State
│   └── api/
│       ├── payload.ts         # Axios instance for CMS
│       └── nestjs.ts          # Axios instance + interceptors for App Backend
└── types/
    └── dto.ts                 # Zod schemas & TS Interfaces matching NestJS backend
```

🛡️ Senior Implementation Guidelines
Strict Type Alignment: Export Zod schemas and TypeScript interfaces that strictly match the NestJS Backend DTOs. LocationType on the frontend must exactly match the Prisma Enum on the backend.

State Isolation: Keep the Map Editor State (Zustand) completely separate from Server State (TanStack Query). The canvas should update instantaneously in Zustand, but only sync to the NestJS database when the user explicitly hits "Save".

API Separation of Concerns: Never mix Payload CMS queries with NestJS API mutations. Keep the axios instances in lib/api/ strictly separated to prevent token leakage or crossed requests.
