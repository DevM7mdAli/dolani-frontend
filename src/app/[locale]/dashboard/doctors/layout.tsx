// Faculty Layout
import { FacultyHeader, FacultySidebar } from '@/components/layout/faculty-sidebar';

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <FacultySidebar />
      <main className="flex-1 overflow-y-auto">
        <FacultyHeader />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
