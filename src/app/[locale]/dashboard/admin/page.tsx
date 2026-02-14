import { useTranslations } from 'next-intl';

export default function AdminDashboardPage() {
  const t = useTranslations('Admin');

  return (
    <div className="space-y-4">
      <h1 className="text-primary text-3xl font-bold">{t('analytics')}</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Placeholder Cards */}
        <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Active Beacons</h3>
          <p className="text-secondary-foreground mt-2 text-4xl font-bold">12</p>
        </div>
        <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Total Rooms</h3>
          <p className="text-secondary-foreground mt-2 text-4xl font-bold">8</p>
        </div>
        <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Active Users</h3>
          <p className="text-secondary-foreground mt-2 text-4xl font-bold">145</p>
        </div>
      </div>
    </div>
  );
}
