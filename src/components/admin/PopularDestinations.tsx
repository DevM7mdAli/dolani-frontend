import { JSX } from 'react';

import { Card } from '@/components/ui/card';

export default function PopularDestinations(): JSX.Element {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold text-slate-800">Popular Destinations</h3>
        <p className="text-xs text-slate-500">Most searched rooms today</p>
      </div>
      <div className="space-y-4 p-5">
        {/* Room 1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Room A201 Lab</p>
              <p className="text-xs text-slate-500">Building A, Floor 2</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-teal-800">342</p>
              <p className="text-xs text-slate-500">visits</p>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[85%] rounded-full bg-teal-800" />
          </div>
        </div>

        {/* Room 2 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Library - Main Hall</p>
              <p className="text-xs text-slate-500">Building C, Ground Floor</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-teal-800">298</p>
              <p className="text-xs text-slate-500">visits</p>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[70%] rounded-full bg-teal-800" />
          </div>
        </div>

        {/* Room 3 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Cafeteria</p>
              <p className="text-xs text-slate-500">Ground Building, Floor 1</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-teal-800">256</p>
              <p className="text-xs text-slate-500">visits</p>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[65%] rounded-full bg-teal-800" />
          </div>
        </div>

        {/* Room 4 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Dean&apos;s Office</p>
              <p className="text-xs text-slate-500">Building A, Floor 3</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-teal-800">187</p>
              <p className="text-xs text-slate-500">visits</p>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[45%] rounded-full bg-teal-800" />
          </div>
        </div>
      </div>
    </Card>
  );
}
