import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { Card } from '@/components/ui/card';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: 'green' | 'red' | 'blue';
  bgColor?: string;
  iconBg?: string;
  iconColor?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  trend,
  trendColor = 'green',
  bgColor = 'bg-gray-50',
  iconBg = 'bg-gray-200',
  iconColor = 'text-gray-600',
}: StatCardProps) => (
  <Card className={`${bgColor} border-0 p-6 shadow-sm transition-all hover:shadow-md`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">{label}</p>
        <p className="mt-3 text-4xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            {trendColor === 'green' ? (
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            ) : trendColor === 'red' ? (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            ) : null}
            <p
              className={`text-xs font-semibold ${
                trendColor === 'green'
                  ? 'text-green-600'
                  : trendColor === 'red'
                    ? 'text-red-600'
                    : 'text-blue-600'
              }`}
            >
              {trend}
            </p>
          </div>
        )}
      </div>
      <div className={`rounded-2xl ${iconBg} p-4 ${iconColor}`}>{icon}</div>
    </div>
  </Card>
);
