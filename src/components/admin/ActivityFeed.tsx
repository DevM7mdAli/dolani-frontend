import { JSX } from 'react';

import { Building, Location, People, Wifi } from 'iconsax-react';

import { Card } from '@/components/ui/card';

export default function ActivityFeed(): JSX.Element {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
        <p className="text-xs text-slate-500">Latest access requests and system events</p>
      </div>
      <div className="space-y-3 p-5">
        {/* Item 1 */}
        <div className="flex items-start gap-3 rounded-2xl bg-sky-50 p-4">
          <div className="rounded-2xl bg-teal-700 p-3">
            <Location size={20} color="#ffffff" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">Active user in room A201</p>
            <p className="text-xs text-slate-500">Building A • Floor 2 • 15 minutes ago</p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4">
          <div className="rounded-2xl bg-amber-500 p-3">
            <Wifi size={20} color="#ffffff" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">Beacon B2-045 reconnected</p>
            <p className="text-xs text-slate-500">Building B • Floor 2 • 5 minutes ago</p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-start gap-3 rounded-2xl bg-slate-100 p-4">
          <div className="rounded-2xl bg-slate-700 p-3">
            <People size={20} color="#ffffff" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">Dr. Ahmed updated office hours</p>
            <p className="text-xs text-slate-500">Faculty Management • 1 hour ago</p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex items-start gap-3 rounded-2xl bg-sky-50 p-4">
          <div className="rounded-2xl bg-teal-700 p-3">
            <Building size={20} color="#ffffff" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">New room added</p>
            <p className="text-xs text-slate-500">Building C • Floor 3 • 3 hours ago</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
