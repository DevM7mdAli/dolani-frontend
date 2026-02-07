import { JSX } from 'react';

import { Activity, Warning2 } from 'iconsax-react';

import { Card } from '@/components/ui/card';

export default function SystemAlerts(): JSX.Element {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold text-slate-800">System Alerts</h3>
        <p className="text-xs text-slate-500">Issues that require your attention</p>
      </div>
      <div className="space-y-3 p-5">
        {/* Warning 1 */}
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4">
          <div className="rounded-2xl bg-amber-100/60 p-2.5">
            <Warning2 size={20} color="#D97706" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">Low battery warning</p>
            <p className="text-xs text-slate-500">
              Gateway A1-023 at 12% • Building A, Floor 1 • 1 hour ago
            </p>
          </div>
        </div>

        {/* Warning 2 */}
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4">
          <div className="rounded-2xl bg-amber-100/60 p-2.5">
            <Warning2 size={20} color="#D97706" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">Weak signal</p>
            <p className="text-xs text-slate-500">
              Gateway BG-056 signal strength issue • Building B, Floor 2 • 3 hours ago
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 rounded-2xl bg-slate-100 p-4">
          <div className="rounded-2xl bg-slate-200/60 p-2.5">
            <Activity size={20} color="#2563EB" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">Scheduled maintenance</p>
            <p className="text-xs text-slate-500">
              Network maintenance scheduled • Building C, Feb 11 2-4 AM
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
