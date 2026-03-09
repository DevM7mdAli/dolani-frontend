import { type RoomStatistics } from '@/types/admin';

import { Card } from '@/components/ui/card';

interface RoomStatsCardsProps {
  stats: RoomStatistics;
  isLoading: boolean;
}

export function RoomStatsCards({ stats, isLoading }: RoomStatsCardsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <Card className="border-l-primary border-l-4 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-600">Total Rooms</p>
        <h3 className="text-primary mt-2 text-2xl font-bold">{isLoading ? '-' : stats.total}</h3>
        <p className="mt-1 text-xs text-gray-500">All Spaces</p>
      </Card>
      <Card className="border-l-secondary border-l-4 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-600">Classrooms</p>
        <div className="mt-2 flex items-center gap-2">
          <h3 className="text-primary text-2xl font-bold">{isLoading ? '-' : stats.classrooms}</h3>
          <span className="text-secondary text-xs font-bold">
            {isLoading ? '-' : `${stats.classroomsPercentage}%`}
          </span>
        </div>
        <p className="text-secondary mt-1 text-xs">Classes</p>
      </Card>
      <Card className="border-l-primary border-l-4 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-600">Faculty Offices</p>
        <div className="mt-2 flex items-center gap-2">
          <h3 className="text-primary text-2xl font-bold">{isLoading ? '-' : stats.offices}</h3>
          <span className="text-primary/70 text-xs font-bold">
            {isLoading ? '-' : `${stats.officesPercentage}%`}
          </span>
        </div>
        <p className="text-primary/70 mt-1 text-xs">Offices</p>
      </Card>
      <Card className="border-l-destructive border-l-4 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-600">Labs</p>
        <div className="mt-2 flex items-center gap-2">
          <h3 className="text-primary text-2xl font-bold">{isLoading ? '-' : stats.labs}</h3>
          <span className="text-destructive text-xs font-bold">
            {isLoading ? '-' : `${stats.labsPercentage}%`}
          </span>
        </div>
        <p className="text-destructive mt-1 text-xs">Labs</p>
      </Card>
    </div>
  );
}
