# Dolani - Smart Indoor Navigation System (Frontend)

![Next.js 15](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue) ![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-cyan) ![Status](https://img.shields.io/badge/Status-Development-orange)

A sophisticated, bilingual (English/Arabic) indoor navigation and faculty management web application for the College of Computer Science and Information Technology (CCSIT) at Imam Abdulrahman Bin Faisal University.

This repository contains the **Frontend** source code, built with **Next.js 15 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 🚀 Features

- **Bilingual Support (i18n):** Full support for English (LTR) and Arabic (RTL) layouts using `next-intl`.
- **Admin Dashboard:** Analytics, interactive map editor, and room/faculty management.
- **Faculty Portal:** Real-time status toggle (Available/Busy/Away) and schedule management.
- **Public Landing Page:** Responsive marketing page with animations and project details.
- **State Management:** Robust global state using **Zustand** (client) and **TanStack Query** (server).
- **Modern UI:** High-quality components powered by **Shadcn UI** and **Framer Motion**.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Validation:** [Zod](https://zod.dev/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

1.  **Node.js**: Version **18.17.0** or later (Required for Next.js 15).
    - Verify with: `node -v`
2.  **Package Manager**: We recommend **pnpm** (fast and disk-efficient), but npm or yarn will work too.
    - Install pnpm: `npm install -g pnpm`

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/DevM7mdAli/dolani-frontend.git
cd dolani-frontend
```

### 2. Install Dependencies

Use `pnpm` to install all required packages.

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a local environment file `.env.local` in the root directory.

```bash
touch .env.local
```

Open `.env.local` and add the following variables:

```env
# API Endpoint (Change this to your backend URL)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Environment (development | production | test)
NODE_ENV=development
```

> **Note:** The `src/env.ts` file validates these variables at build time. If they are missing or invalid, the app will throw an error.

### 4. Run the Development Server

Start the application in development mode with Turbopack (faster HMR).

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Landing Page**: `http://localhost:3000` (Redirects to `/en` or `/ar`)
- **Admin Dashboard**: `/en/dashboard/admin`
- **Faculty Portal**: `/en/dashboard/doctors`

---

## 📂 Project Structure

Verified Senior-Level Architecture:

```plaintext
src/
├── app/                  # Next.js App Router
│   ├── [locale]/         # Dynamic locale segment (en/ar)
│   │   ├── dashboard/    # Protected Dashboard Routes
│   │   │   ├── admin/    # Admin-specific pages
│   │   │   └── doctors/  # Faculty-specific pages
│   │   ├── signin/       # Authentication pages
│   │   └── page.tsx      # Landing Page
│   └── globals.css       # Global styles & Tailwind
├── components/           # React Components
│   ├── landing/          # Landing page specific components (Hero, Nav, etc.)
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── ui/               # Reusable UI primitives (Buttons, Cards, Inputs)
├── hooks/                # Custom React Hooks
├── i18n/                 # Internationalization Config
│   ├── request.ts        # Request-scoped i18n setup
│   └── routing.ts        # Routing configuration & navigation helpers
├── lib/                  # Utilities & Libraries
│   ├── axios.ts          # Configured Axios instance (Interceptors)
│   └── utils.ts          # Helper functions (cn, formatting)
├── messages/             # Translation strings (JSON)
│   ├── ar.json           # Arabic translations
│   └── en.json           # English translations
├── store/                # Global State (Zustand)
│   └── useUIStore.ts     # UI state (Sidebar, Theme, etc.)
├── env.ts                # Environment Variable Validation Schema
└── middleware.ts         # Next.js Middleware (Auth & i18n routing)
```

---

## 🌍 Internationalization (i18n)

This project uses `next-intl`.

1.  **Adding Translations:**
    - Edit `src/messages/en.json` for English.
    - Edit `src/messages/ar.json` for Arabic.
    - Keep keys consistent between both files to avoid missing translation errors.

2.  **Usage in Components:**

    ```tsx
    import { useTranslations } from 'next-intl';

    export default function MyComponent() {
      const t = useTranslations('Common');
      return <h1>{t('welcome')}</h1>;
    }
    ```

3.  **Routing:**
    Use strict navigation helpers from `@/i18n/routing` instead of `next/link` or `next/navigation`.

    ```tsx
    import { Link, useRouter } from '@/i18n/routing';
    ```

---

## 📦 Build & Deploy

To create an optimized production build:

```bash
pnpm build
```

To start the production server locally after building:

```bash
pnpm start
```

---

## 🤝 Contribution

1.  Create a new branch: `git checkout -b feature/amazing-feature`
2.  Commit your changes: `git commit -m 'feat: Add amazing feature'`
3.  Push to the branch: `git push origin feature/amazing-feature`
4.  Open a Pull Request.

---

## 📄 License

© 2026 Dolani Group 06.
College of Computer Science and Information Technology (CCSIT),
Imam Abdulrahman Bin Faisal University.
