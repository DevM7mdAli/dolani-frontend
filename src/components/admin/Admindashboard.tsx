'use client';

import { JSX } from 'react';

import ActivityFeed from './ActivityFeed';
import PopularDestinations from './PopularDestinations';
import QuickActions from './QuickActions';
import StatsCards from './StatsCards';
import SystemAlerts from './SystemAlerts';
import SystemStatus from './SystemStatus';

export default function AdminDashboardPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Stats Cards - Top 3 */}
        <StatsCards />

        {/* Quick Access Section */}
        <QuickActions />

        {/* Two Column Layout - Activity & Status */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityFeed />
          <SystemStatus />
        </div>

        {/* Bottom Two Columns - Destinations & Alerts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PopularDestinations />
          <SystemAlerts />
        </div>
      </div>
    </div>
  );
}
