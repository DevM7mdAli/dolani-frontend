import { ITHeader, ITSidebar } from '@/components/layout/it-sidebar';

export default function ITLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <ITSidebar />
      <main className="flex-1 overflow-y-auto">
        <ITHeader />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
