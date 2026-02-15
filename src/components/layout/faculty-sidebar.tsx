'use client';

import { useLogout } from '@/hooks/useAuth';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export function FacultySidebar() {
  const t = useTranslations('Faculty');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  const initials = user?.name
    ? user.name
        .replace(/^(Dr\.|أ\.|د\.)\s*/i, '')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  const links = [
    { href: '/dashboard/doctors/profile', label: t('myProfile'), icon: User },
    { href: '/dashboard/doctors/office-hours', label: t('officeHours'), icon: Clock },
    { href: '/dashboard/doctors/schedule', label: t('schedule'), icon: Calendar },
    { href: '/dashboard/doctors/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'bg-card border-border sticky top-0 flex min-h-screen flex-col border-r transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Header */}
      <div className="border-border flex h-14 items-center justify-between border-b px-4">
        {!isSidebarCollapsed && <h1 className="text-primary text-lg font-bold">{t('title')}</h1>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* User Profile + Status */}
      {!isSidebarCollapsed && (
        <div className="border-border space-y-3 border-b p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name ?? 'Faculty'}</p>
              <p className="text-muted-foreground truncate text-xs">
                {user?.role === 'FACULTY' ? 'Faculty Member' : user?.role}
              </p>
            </div>
          </div>
          {/* Status Dropdown */}
          <button className="flex w-full items-center justify-between rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {t('available')}
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Collapsed: just show avatar */}
      {isSidebarCollapsed && (
        <div className="border-border flex justify-center border-b py-3">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold">
            {initials}
          </div>
        </div>
      )}

      {/* Navigation */}
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

      {/* Sign Out */}
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
  doctors: 'myProfile',
  profile: 'myProfile',
  'office-hours': 'officeHours',
  schedule: 'schedule',
  settings: 'settings',
};

export function FacultyHeader() {
  const t = useTranslations('Faculty');
  const segment = usePathname().split('/').pop() ?? 'profile';

  return (
    <header className="border-border flex h-14 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h2 className="text-primary text-lg font-semibold">
        {t(segmentKeys[segment] ?? 'myProfile')}
      </h2>
      <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        {t('available')}
      </div>
    </header>
  );
}
