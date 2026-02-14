'use client';

import { useLogout } from '@/hooks/useAuth';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useUIStore } from '@/store/useUIStore';
import {
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Radio,
  Settings,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export function Sidebar() {
  const t = useTranslations('Admin');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  const links = [
    { href: '/dashboard/admin', label: t('analytics'), icon: LayoutDashboard },
    { href: '/dashboard/admin/map', label: t('mapEditor'), icon: Map },
    { href: '/dashboard/admin/rooms', label: t('rooms'), icon: DoorOpen },
    { href: '/dashboard/admin/doctors', label: t('faculty'), icon: Users },
    { href: '/dashboard/admin/beacons', label: t('beacons'), icon: Radio },
    { href: '/dashboard/admin/reports', label: t('reports'), icon: FileText },
    { href: '/dashboard/admin/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'bg-card border-border sticky top-0 flex min-h-screen flex-col border-r transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="border-border flex h-14 items-center justify-between border-b px-4">
        {!isSidebarCollapsed && <h1 className="text-primary text-xl font-bold">Dolani</h1>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={cn(
                  'hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md p-2 transition-colors',
                  isActive && 'bg-secondary text-secondary-foreground font-medium',
                  isSidebarCollapsed && 'justify-center',
                )}
              >
                <Icon className="h-5 w-5" />
                {!isSidebarCollapsed && <span>{link.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t p-4">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground w-full justify-start gap-2"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-5 w-5" />
          {!isSidebarCollapsed && (
            <span>{logoutMutation.isPending ? 'Signing out...' : tCommon('signOut')}</span>
          )}
        </Button>
      </div>
    </aside>
  );
}

const segmentKeys: Record<string, string> = {
  admin: 'analytics',
  map: 'mapEditor',
  rooms: 'rooms',
  doctors: 'faculty',
  beacons: 'beacons',
  reports: 'reports',
  settings: 'settings',
};

export function AdminHeader() {
  const t = useTranslations('Admin');
  const segment = usePathname().split('/').pop() ?? 'admin';

  return (
    <header className="border-border flex h-14 items-center border-b bg-white px-6 shadow-sm">
      <h2 className="text-primary text-lg font-semibold">
        {t(segmentKeys[segment] ?? 'analytics')}
      </h2>
    </header>
  );
}
