'use client';

import { useLogout } from '@/hooks/useAuth';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { ChevronLeft, ChevronRight, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { getInitials } from '@/lib/get-initials';
import { cn } from '@/lib/utils';

export function ITSidebar() {
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

  const t = useTranslations('IT');

  const links = [
    { href: '/dashboard/it', label: t('sidebar.overview'), icon: LayoutDashboard, exact: true },
    { href: '/dashboard/it/reports', label: t('sidebar.reports'), icon: FileText, exact: false },
  ];

  const initials = user?.name ? getInitials(user.name) : '??';

  return (
    <aside
      className={cn(
        'bg-card border-border sticky top-0 flex min-h-screen flex-col border-r transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Header */}
      <div className="border-border flex h-14 items-center justify-between border-b px-4">
        {!isSidebarCollapsed && (
          <h1 className="text-primary text-lg font-bold">{t('sidebar.title')}</h1>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* User info */}
      {!isSidebarCollapsed ? (
        <div className="border-border border-b p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name ?? t('sidebar.role')}</p>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {t('sidebar.role')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-border flex justify-center border-b py-3">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold">
            {initials}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  'hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md p-2 transition-colors',
                  isActive && 'bg-secondary text-secondary-foreground font-medium',
                  isSidebarCollapsed && 'justify-center',
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isSidebarCollapsed && <span>{label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
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
            <span>{logoutMutation.isPending ? t('sidebar.signingOut') : t('sidebar.signOut')}</span>
          )}
        </Button>
      </div>
    </aside>
  );
}

export function ITHeader() {
  const pathname = usePathname();
  const t = useTranslations('IT');
  const segments = pathname.split('/').filter(Boolean);

  const segmentTitles: Record<string, string> = {
    it: t('sidebar.overview'),
    reports: t('sidebar.reports'),
  };

  // last segment: could be 'it', 'reports', or a numeric id
  const last = segments[segments.length - 1] ?? 'it';
  const isNumeric = /^\d+$/.test(last);

  let title = t('sidebar.overview');
  if (isNumeric) {
    title = t('sidebar.reportNumber', { id: last });
  } else {
    title = segmentTitles[last] ?? t('sidebar.itDashboard');
  }

  return (
    <header className="border-border flex h-14 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h2 className="text-primary text-lg font-semibold">{title}</h2>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        {t('sidebar.role')}
      </span>
    </header>
  );
}
