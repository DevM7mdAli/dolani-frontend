import { JSX } from 'react';

import { Card } from '@/components/ui/card';

export default function SystemStatus(): JSX.Element {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold text-slate-800">System Status</h3>
        <p className="text-xs text-slate-500">Monitoring system infrastructure health</p>
      </div>
      <div className="space-y-3 p-5">
        {/* Active Status 1 */}
        <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Network</p>
              <p className="text-xs text-slate-500">All BLE services running</p>
            </div>
          </div>
          <span className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
            Online
          </span>
        </div>

        {/* Active Status 2 */}
        <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Monitoring</p>
              <p className="text-xs text-slate-500">Firecloud active</p>
            </div>
          </div>
          <span className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
            Online
          </span>
        </div>

        {/* Warning Status */}
        <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Beacon Maintenance</p>
              <p className="text-xs text-slate-500">6 disconnected sessions</p>
            </div>
          </div>
          <span className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white">
            Warning
          </span>
        </div>

        {/* Active Status 3 */}
        <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Gateway</p>
              <p className="text-xs text-slate-500">Response time 409ms</p>
            </div>
          </div>
          <span className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
            Healthy
          </span>
        </div>
      </div>
    </Card>
  );
}
