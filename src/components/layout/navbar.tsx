// Assuming the logo is a map pin style
import { JSX } from 'react';

import { MapPin } from 'lucide-react';

import { Card } from '@/components/ui/card';

export default function DolaniHeader(): JSX.Element {
  return (
    <Card className="w-full overflow-hidden rounded-none border-none bg-linear-to-r from-[#003B46] to-[#075e6e] p-6 text-white">
      <div className="flex items-center justify-between">
        {/* Left Side (English/Logo) - Flex row-reverse helps align items for Arabic context */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            {/* Logo and Title Group */}
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#f0b429] p-1.5">
                <MapPin className="h-4 w-4 text-[#003B46]" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-lg leading-tight font-bold">Dolani</h1>
                <p className="text-sm opacity-80">Admin Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Last Update) */}
        <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <p className="text-sm font-medium">Last update</p>
        </div>
      </div>

      {/* Footer Text */}
      <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
        <span>Indoor Navigation Control Panel</span>
      </div>
    </Card>
  );
}
