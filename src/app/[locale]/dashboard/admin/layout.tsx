// Admin Layout
import { Sidebar } from '@/components/layout/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-card border-border border-b p-4 shadow-sm">
          {/* Topbar content (Breadcrumbs, User Profile) can go here */}
          <div className="h-6"></div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
