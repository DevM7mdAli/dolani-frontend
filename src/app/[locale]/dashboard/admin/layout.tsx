// Admin Layout
import { AdminHeader, Sidebar } from '@/components/layout/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <AdminHeader />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
