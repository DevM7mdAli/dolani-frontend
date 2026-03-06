import { type RoomStatistics } from '@/types/admin';

import { Card } from '@/components/ui/card';

interface RoomStatsCardsProps {
  stats: RoomStatistics;
  isLoading: boolean;
}

export function RoomStatsCards({ stats, isLoading }: RoomStatsCardsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total Rooms</p>
        <h3 className="mt-2 text-2xl font-bold">{isLoading ? '-' : stats.total}</h3>
        <p className="mt-1 text-xs text-gray-400">All Spaces</p>
      </Card>
      <Card className="border-l-4 border-l-green-500 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Active Rooms</p>
        <div className="mt-2 flex items-center gap-2">
          <h3 className="text-2xl font-bold">{isLoading ? '-' : stats.active}</h3>
          <span className="text-xs font-bold text-green-500">
            {isLoading ? '-' : `${stats.activePercentage}%`}
          </span>
        </div>
        <p className="text-xs text-green-500">Active</p>
      </Card>
      <Card className="border-l-4 border-l-orange-400 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Faculty Offices</p>
        <div className="mt-2 flex items-center gap-2">
          <h3 className="text-2xl font-bold">{isLoading ? '-' : stats.offices}</h3>
          <span className="text-xs font-bold text-orange-400">
            {isLoading ? '-' : `${stats.officesPercentage}%`}
          </span>
        </div>
        <p className="text-xs text-orange-400">Offices</p>
      </Card>
      <Card className="border-l-4 border-l-red-500 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Labs</p>
        <div className="mt-2 flex items-center gap-2">
          <h3 className="text-2xl font-bold">{isLoading ? '-' : stats.labs}</h3>
          <span className="text-xs font-bold text-red-500">
            {isLoading ? '-' : `${stats.labsPercentage}%`}
          </span>
        </div>
        <p className="text-xs text-red-500">Labs</p>
      </Card>
    </div>
  );
}
