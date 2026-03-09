import { Signal, Wifi, WifiOff } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface BeaconStatsCardsProps {
  totalBeacons: number;
  activeBeacons: number;
  inactiveBeacons: number;
}

export function BeaconStatsCards({
  totalBeacons,
  activeBeacons,
  inactiveBeacons,
}: BeaconStatsCardsProps) {
  return (
    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="border-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Total Beacons
              </p>
              <p className="mt-3 text-4xl font-bold text-gray-900">{totalBeacons}</p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-4 text-blue-600">
              <Signal className="h-6 w-6" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">Active</p>
              <p className="mt-3 text-4xl font-bold text-gray-900">{activeBeacons}</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-4 text-green-600">
              <Wifi className="h-6 w-6" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Offline
              </p>
              <p className="mt-3 text-4xl font-bold text-gray-900">{inactiveBeacons}</p>
            </div>
            <div className="rounded-2xl bg-red-100 p-4 text-red-600">
              <WifiOff className="h-6 w-6" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
