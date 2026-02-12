'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useUIStore } from '@/store/useUIStore';
import {
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  LayoutDashboard,
  LogOut,
  Map,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export function Sidebar() {
  const t = useTranslations('Admin');
  const tCommon = useTranslations('Common');
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  const links = [
    { href: '/dashboard/admin', label: t('analytics'), icon: LayoutDashboard },
    { href: '/dashboard/admin/map', label: t('mapEditor'), icon: Map },
    { href: '/dashboard/admin/rooms', label: t('rooms'), icon: DoorOpen },
    { href: '/dashboard/admin/doctors', label: t('faculty'), icon: Users },
  ];

  return (
    <aside
      className={cn(
        'bg-card border-border flex h-screen flex-col border-r transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="border-border flex items-center justify-between border-b p-4">
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
        <Link href="/signin">
          <div
            className={cn(
              'hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex items-center gap-2 rounded-md p-2 transition-colors',
              isSidebarCollapsed && 'justify-center',
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isSidebarCollapsed && <span>{tCommon('signOut')}</span>}
          </div>
        </Link>
      </div>
    </aside>
  );
}
