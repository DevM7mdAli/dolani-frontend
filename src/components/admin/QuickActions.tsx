'use client';

import { useRouter } from 'next/navigation';
import { JSX } from 'react';

import { Building, DocumentText, Map, People, Setting2, Wifi } from 'iconsax-react';

import { Card } from '@/components/ui/card';

export default function QuickActions(): JSX.Element {
  const router = useRouter();

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
        <p className="text-xs text-slate-500">Quick access to common tasks</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* Room Management */}
        <button
          onClick={() => router.push('/dashboard/room-management')}
          className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/30 p-6 transition-all hover:bg-slate-50"
        >
          <div className="rounded-2xl bg-teal-700 p-4">
            <Building size={24} color="#ffffff" />
          </div>
          <p className="text-center text-xs font-medium text-slate-700">Room Management</p>
        </button>

        {/* Visit Management */}
        <button
          onClick={() => router.push('/dashboard/visits')}
          className="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-6 transition-all hover:bg-amber-50"
        >
          <div className="rounded-2xl bg-amber-500 p-4">
            <Wifi size={24} color="#ffffff" />
          </div>
          <p className="text-center text-xs font-medium text-slate-700">Visit Management</p>
        </button>

        {/* Map View */}
        <button
          onClick={() => router.push('/dashboard/map')}
          className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/30 p-6 transition-all hover:bg-slate-50"
        >
          <div className="rounded-2xl bg-teal-700 p-4">
            <Map size={24} color="#ffffff" />
          </div>
          <p className="text-center text-xs font-medium text-slate-700">Map View</p>
        </button>

        {/* Reports */}
        <button
          onClick={() => router.push('/dashboard/reports')}
          className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/30 p-6 transition-all hover:bg-slate-50"
        >
          <div className="rounded-2xl bg-teal-700 p-4">
            <DocumentText size={24} color="#ffffff" />
          </div>
          <p className="text-center text-xs font-medium text-slate-700">Reports</p>
        </button>

        {/* Faculty Management */}
        <button
          onClick={() => router.push('/dashboard/faculty')}
          className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/30 p-6 transition-all hover:bg-slate-50"
        >
          <div className="rounded-2xl bg-teal-700 p-4">
            <People size={24} color="#ffffff" />
          </div>
          <p className="text-center text-xs font-medium text-slate-700">Faculty Management</p>
        </button>

        {/* System Settings */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/30 p-6 transition-all hover:bg-slate-50"
        >
          <div className="rounded-2xl bg-teal-700 p-4">
            <Setting2 size={24} color="#ffffff" />
          </div>
          <p className="text-center text-xs font-medium text-slate-700">System Settings</p>
        </button>
      </div>
    </Card>
  );
}
