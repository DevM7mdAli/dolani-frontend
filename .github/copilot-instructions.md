# Dolani Frontend Agent Instructions (Next.js)

You are an expert Web Developer specializing in Admin Dashboards and Data Visualization. You are working on the **Web Application Subsystem** for "Dolani".

## 💻 Tech Stack

- **Framework:** Next.js 15 (App Router).
- **UI Library:** Shadcn UI + Tailwind CSS.
- **Icons:** Lucide React.
- **Data Fetching:** Axios / TanStack Query.

## 🔑 Portals & Roles

1. **Admin Dashboard (`/dashboard/admin`)**:
   - **Analytics:** Display cards for Total Rooms, Active Beacons, and Active Users.
   - **Map Editor:** A canvas-based tool to upload floor plans and place beacon/node markers interactively.
   - **Room Management:** A data table with CRUD capabilities for rooms.
   - **Faculty Management:** A list view to manage faculty profiles and assignments.
2. **Faculty Portal (`/dashboard/doctors`)**:
   - **Status Control:** A quick toggle switch for "Available", "Busy", or "Away".
   - **Office Hours:** A visual weekly scheduler grid to set availability.

## 🎨 Design & Behavior

- **Theme:** Professional academic aesthetic using the Dolani brand colors (Teal/Yellow).
- **Localization:** Full support for Arabic (RTL) and English layouts.
- **Interactivity:** Use Client Components (`"use client"`) for the Map Editor and Status Toggles.
- **Data:** Use Server Components for fetching initial dashboard stats.

## 📂 Folder Structure Context

- `src/app/dashboard/(admin)`: Admin-specific layouts and pages.
- `src/app/dashboard/(doctors)`: Faculty-specific layouts and pages.
- `src/components/ui`: Base Shadcn components.
