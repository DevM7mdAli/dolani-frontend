import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';

export default function FacultyPage() {
  const t = useTranslations('Faculty');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold">{t('status')}</h2>
        <div className="flex gap-4">
          {/* Mock Toggles */}
          <div className="bg-accent/20 border-accent hover:bg-accent/40 flex-1 cursor-pointer rounded-lg border p-4 text-center transition">
            <span className="mb-1 block font-bold">🟢 {t('available')}</span>
          </div>
          <div className="bg-card border-border hover:bg-muted text-muted-foreground flex-1 cursor-pointer rounded-lg border p-4 text-center transition">
            <span className="mb-1 block font-bold">🔴 {t('busy')}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold">{t('schedule')}</h2>
        <div className="bg-muted/20 border-border text-muted-foreground flex h-64 items-center justify-center rounded-lg border border-dashed">
          Weekly Scheduler Placeholder
        </div>
      </Card>
    </div>
  );
}
