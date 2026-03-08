import { ActivityItem } from '@/components/admin/analytics/ActivitySection';
import { HealthMetric } from '@/components/admin/analytics/HealthSection';
import { MostVisitedCard } from '@/components/admin/analytics/InsightsGrid';
import { StatCard } from '@/components/admin/analytics/StatsCards';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Clock,
  MapPin,
  Signal,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const t = useTranslations('Admin');

  const recentActivities = [
    {
      name: 'Lab 201',
      action: 'Capacity updated to 30 students',
      time: '2 hours ago',
      avatar: 'bg-blue-600',
    },
    {
      name: 'Meeting Room A-305',
      action: 'Location added to system',
      time: '5 hours ago',
      avatar: 'bg-amber-600',
    },
    {
      name: 'Library - East Wing',
      action: 'Beacon network updated',
      time: '1 day ago',
      avatar: 'bg-teal-600',
    },
  ];

  const mostVisitedLocations = [
    {
      name: 'Lab 201',
      visitors: 145,
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Library',
      visitors: 128,
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      name: 'Office A-305',
      visitors: 96,
      icon: <Users className="h-5 w-5" />,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{t('analytics')}</h1>
        <p className="mt-2 text-base text-gray-600">System overview and real-time metrics</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Active Beacons"
          value="12"
          icon={<Signal className="h-6 w-6" />}
          trend="↑ 2 this week"
          trendColor="green"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Total Rooms"
          value="8"
          icon={<MapPin className="h-6 w-6" />}
          trend="All mapped"
          trendColor="blue"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Active Users"
          value="145"
          icon={<Users className="h-6 w-6" />}
          trend="↑ 12 today"
          trendColor="green"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Section: Analytics & Health */}
      <div>
        <div className="mb-6 flex items-center gap-2">
          <BarChart3 className="text-primary h-5 w-5" />
          <h2 className="text-xl font-bold text-gray-900">Analytics & System Health</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Usage Statistics - Large */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Usage Statistics</h3>
                  <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-400">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>
              <div className="flex h-80 items-center justify-center rounded-b-lg bg-gray-50 p-8">
                <div className="text-center">
                  <div className="mx-auto mb-3 inline-flex rounded-lg bg-white p-4">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Charts and detailed analytics</p>
                  <p className="text-xs text-gray-500">will be displayed here</p>
                </div>
              </div>
            </Card>
          </div>

          {/* System Health */}
          <div>
            <Card className="border-0 shadow-sm">
              <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">System Health</h3>
                </div>
              </div>
              <div className="flex h-80 flex-col justify-center space-y-5 p-6">
                <HealthMetric label="Beacon Uptime" value="98%" color="bg-green-500" />
                <HealthMetric label="Server Response" value="45ms" color="bg-blue-500" />
                <HealthMetric label="Success Rate" value="99.2%" color="bg-emerald-500" />
                <HealthMetric label="Database Load" value="72%" color="bg-amber-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Section: Activity & Insights */}
      <div>
        <div className="mb-6 flex items-center gap-2">
          <Activity className="text-primary h-5 w-5" />
          <h2 className="text-xl font-bold text-gray-900">Activity & Insights</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Most Visited Locations */}
          <Card className="border-0 shadow-sm lg:col-span-2">
            <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-primary h-5 w-5" />
                <h3 className="font-bold text-gray-900">Most Visited Locations</h3>
              </div>
            </div>
            <div className="space-y-3 p-6">
              {mostVisitedLocations.map((location) => (
                <MostVisitedCard key={location.name} {...location} />
              ))}
            </div>
            <div className="border-t border-gray-100 bg-gray-50/50 p-4">
              <button className="w-full rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100">
                View All Statistics →
              </button>
            </div>
          </Card>

          {/* Recent Changes */}
          <Card className="border-0 shadow-sm lg:col-span-1">
            <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white p-6">
              <div className="flex items-center gap-2">
                <Clock className="text-primary h-5 w-5" />
                <h3 className="font-bold text-gray-900">Recent Changes</h3>
              </div>
            </div>
            <div className="space-y-3 p-6">
              {recentActivities.map((activity, idx) => (
                <ActivityItem key={idx} {...activity} />
              ))}
            </div>
            <div className="border-t border-gray-100 bg-gray-50/50 p-4">
              <button className="w-full rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100">
                View All Changes →
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Insights Grid */}
      <div>
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="text-primary h-5 w-5" />
          <h2 className="text-xl font-bold text-gray-900">Key Insights</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm transition-all hover:shadow-md">
            <div className="px-6 pt-4 pb-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Peak Hours
                </p>
                <div className="rounded-lg bg-amber-100 p-2.5 text-amber-600">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">2:00 - 4:00 PM</p>
              <p className="mt-2 text-xs text-gray-600">Most navigations occur</p>
            </div>
          </Card>

          <Card className="border-0 shadow-sm transition-all hover:shadow-md">
            <div className="px-6 pt-4 pb-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Session Duration
                </p>
                <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">8m 32s</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" /> 2m from last week
              </p>
            </div>
          </Card>

          <Card className="border-0 shadow-sm transition-all hover:shadow-md">
            <div className="px-6 pt-4 pb-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Success Rate
                </p>
                <div className="rounded-lg bg-green-100 p-2.5 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">99.2%</p>
              <p className="mt-2 text-xs text-gray-600">Navigation success</p>
            </div>
          </Card>

          <Card className="border-0 shadow-sm transition-all hover:shadow-md">
            <div className="px-6 pt-4 pb-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Searches
                </p>
                <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">2.4K</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" /> 340 today
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
