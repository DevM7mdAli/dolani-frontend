// Faculty Layout (Status Bar + Content)
'use client';

import { useLogout } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Faculty');
  const tCommon = useTranslations('Common');
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Status Topbar */}
      <header className="bg-primary text-primary-foreground flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Dolani Faculty Portal</h1>
          <div className="bg-primary-foreground/30 h-6 w-px"></div>
          {/* Simple Status Indicator (Mock) */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-400"></span>
            <span className="text-sm font-medium">{t('available')}</span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? 'Signing out...' : tCommon('signOut')}
        </Button>
      </header>

      <main className="container mx-auto max-w-4xl flex-1 p-6">{children}</main>
    </div>
  );
}
