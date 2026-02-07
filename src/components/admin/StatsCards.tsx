import { JSX } from 'react';

import { Building, ProfileCircle, Wifi } from 'iconsax-react';

import { Card } from '@/components/ui/card';

export default function StatsCards(): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Card 1: Total Rooms */}
      <Card className="rounded-2xl border-2 border-slate-700 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600">Total Rooms</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">248</p>
            <p className="mt-1 text-xs text-slate-500">Across 3 buildings</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-2.5">
            <Building size={20} color="#334155" />
          </div>
        </div>
      </Card>

      {/* Card 2: Active Visits */}
      <Card className="rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-600">Active Visits</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">156 / 162</p>
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[96%] bg-teal-800" />
              </div>
              <p className="mt-1 text-right text-xs font-medium text-yellow-600">96.3%</p>
              <p className="text-right text-xs text-slate-500">Active</p>
            </div>
          </div>
          <div className="rounded-xl bg-yellow-100 p-2.5">
            <Wifi size={20} color="#D97706" />
          </div>
        </div>
      </Card>

      {/* Card 3: Active Users */}
      <Card className="rounded-2xl border-2 border-slate-700 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600">Active Users</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">1,247</p>
            <p className="mt-1 text-right text-xs">
              <span className="font-medium text-green-600">+12% </span>
              <span className="text-slate-500">from Last week</span>
            </p>
          </div>
          <div className="rounded-xl bg-slate-100 p-2.5">
            <ProfileCircle size={20} color="#334155" />
          </div>
        </div>
      </Card>
    </div>
  );
}
