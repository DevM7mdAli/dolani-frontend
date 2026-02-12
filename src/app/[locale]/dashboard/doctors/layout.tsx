// Faculty Layout (Status Bar + Content)
import { Link } from '@/i18n/routing';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Faculty');
  const tCommon = useTranslations('Common');

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Status Topbar */}
      <header className="bg-primary text-primary-foreground flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Dolani Faculty Portal</h1>
          <div className="bg-primary-foreground/30 h-6 w-[1px]"></div>
          {/* Simple Status Indicator (Mock) */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-400"></span>
            <span className="text-sm font-medium">{t('available')}</span>
          </div>
        </div>

        <Link href="/signin">
          <Button variant="secondary" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            {tCommon('signOut')}
          </Button>
        </Link>
      </header>

      <main className="container mx-auto max-w-4xl flex-1 p-6">{children}</main>
    </div>
  );
}
