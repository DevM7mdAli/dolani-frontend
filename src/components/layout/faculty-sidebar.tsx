'use client';

import { useLogout } from '@/hooks/useAuth';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import type { ProfessorStatus } from '@/types/faculty';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  LogOut,
  User,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { facultyApi } from '@/lib/api/faculty';
import { getInitials } from '@/lib/get-initials';
import { cn } from '@/lib/utils';

export function FacultySidebar() {
  const t = useTranslations('Faculty');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Fetch real professor profile to get status
  const { data: profile } = useQuery({
    queryKey: ['faculty', 'profile'],
    queryFn: facultyApi.getMyProfile,
  });

  // Mutation to update status
  const statusMutation = useMutation({
    mutationFn: (status: ProfessorStatus) => facultyApi.updateStatus(status),
    onSuccess: (updated) => {
      queryClient.setQueryData(['faculty', 'profile'], updated);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  const initials = user?.name ? getInitials(user.name) : '??';
  const status = profile?.status ?? 'AVAILABLE';
  const isAvailable = status === 'AVAILABLE';

  const links = [
    { href: '/dashboard/doctors/profile', label: t('myProfile'), icon: User },
    { href: '/dashboard/doctors/office-hours', label: t('officeHours'), icon: Clock },
    { href: '/dashboard/doctors/schedule', label: t('schedule'), icon: Calendar },
    { href: '/dashboard/doctors/reports', label: t('reports'), icon: FileText },
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

          {/* Status Select */}
          <Select
            value={status}
            onValueChange={(val) => statusMutation.mutate(val as ProfessorStatus)}
            disabled={statusMutation.isPending}
          >
            <SelectTrigger
              className={cn(
                'w-full text-sm font-medium',
                isAvailable
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700',
              )}
            >
              <span
                className={cn(
                  'mr-2 inline-block h-2 w-2 rounded-full',
                  isAvailable ? 'bg-green-500' : 'bg-red-500',
                )}
              />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">{t('available')}</SelectItem>
              <SelectItem value="NOT_AVAILABLE">{t('notAvailable')}</SelectItem>
            </SelectContent>
          </Select>
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
  reports: 'reports',
};

export function FacultyHeader() {
  const t = useTranslations('Faculty');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const segment = usePathname().split('/').pop() ?? 'profile';

  const { data: profile } = useQuery({
    queryKey: ['faculty', 'profile'],
    queryFn: facultyApi.getMyProfile,
  });

  const status = profile?.status ?? 'AVAILABLE';
  const isAvailable = status === 'AVAILABLE';

  const switchLocale = (newLocale: 'en' | 'ar') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="border-border flex h-14 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h2 className="text-primary text-lg font-semibold">
        {t(segmentKeys[segment] ?? 'myProfile')}
      </h2>
      <div className="flex items-center gap-4">
        {/* Language Toggle Icon */}
        <button
          onClick={() => switchLocale(locale === 'en' ? 'ar' : 'en')}
          title={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Globe className="h-5 w-5" />
        </button>

        {/* Status Badge */}
        <div
          className={cn(
            'flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
            isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
          )}
        >
          <span
            className={cn('h-2 w-2 rounded-full', isAvailable ? 'bg-green-500' : 'bg-red-500')}
          />
          {t(isAvailable ? 'available' : 'notAvailable')}
        </div>
      </div>
    </header>
  );
}
