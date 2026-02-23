'use client';

import React from 'react';

import { useAllReports, useReportStats, useUpdateReportStatus } from '@/hooks/useIT';
import { Link } from '@/i18n/routing';
import type { ReportCategory, ReportStatus, ReportWithRelations } from '@/types/faculty';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DoorOpen,
  FileText,
  HelpCircle,
  Lightbulb,
  Loader2,
  MapPin,
  Monitor,
  Plug,
  Printer,
  Shield,
  Snowflake,
  Sparkles,
  Tv,
  User,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// ─── Shared meta ─────────────────────────────────────────────────────────────

const categoryIcons: Record<ReportCategory, React.ReactNode> = {
  PROJECTOR: <Tv className="h-3.5 w-3.5" />,
  SMART_BOARD: <Monitor className="h-3.5 w-3.5" />,
  COMPUTER: <Monitor className="h-3.5 w-3.5" />,
  PRINTER: <Printer className="h-3.5 w-3.5" />,
  AC: <Snowflake className="h-3.5 w-3.5" />,
  LIGHT: <Lightbulb className="h-3.5 w-3.5" />,
  DOOR: <DoorOpen className="h-3.5 w-3.5" />,
  PLUG: <Plug className="h-3.5 w-3.5" />,
  CLEANLINESS: <Sparkles className="h-3.5 w-3.5" />,
  SAFETY: <Shield className="h-3.5 w-3.5" />,
  OTHER: <HelpCircle className="h-3.5 w-3.5" />,
};

const statusVisuals: Record<ReportStatus, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  RESOLVED: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  borderColor,
  iconColor,
}: {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  borderColor: string;
  iconColor: string;
}) {
  return (
    <Card className={`border-l-4 bg-white p-5 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          {value === undefined ? (
            <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-100" />
          ) : (
            <p className="mt-1 text-3xl font-bold">{value}</p>
          )}
        </div>
        <div className={`rounded-full p-3 ${iconColor} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}

// ─── Pending Report Row ───────────────────────────────────────────────────────

function PendingReportRow({
  report,
  onAction,
  isPending,
}: {
  report: ReportWithRelations;
  onAction: () => void;
  isPending: boolean;
}) {
  const t = useTranslations('IT');
  const locale = useLocale();
  const sv = statusVisuals[report.status];

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
      {/* Left info */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{report.title}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
            {categoryIcons[report.category]}
            {t(`categories.${report.category}` as `categories.${ReportCategory}`)}
          </span>
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {report.room}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {report.professor.full_name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(report.createdAt).toLocaleDateString(locale, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Status badge */}
      <span
        className={`hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${sv.bg} ${sv.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${sv.dot}`} />
        {t(`statuses.${report.status}` as `statuses.${ReportStatus}`)}
      </span>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          size="sm"
          className="bg-blue-500 text-white hover:bg-blue-600"
          disabled={isPending}
          onClick={onAction}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            t('overview.startWorking')
          )}
        </Button>
        <Link href={`/dashboard/it/reports/${report.id}`}>
          <Button size="sm" variant="outline" className="gap-1">
            {t('overview.view')} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ITOverviewPage() {
  const t = useTranslations('IT');
  const { data: stats, isPending: statsPending } = useReportStats();
  const { data: pendingData, isPending: reportsPending } = useAllReports({
    status: 'PENDING',
    limit: 5,
  });
  const updateStatus = useUpdateReportStatus();

  const pendingReports = pendingData?.data ?? [];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold">{t('overview.heading')}</h2>
        <p className="text-muted-foreground text-sm">{t('overview.subtitle')}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label={t('overview.totalReports')}
          value={statsPending ? undefined : stats?.total}
          icon={FileText}
          borderColor="border-l-indigo-400"
          iconColor="text-indigo-500"
        />
        <StatCard
          label={t('overview.pending')}
          value={statsPending ? undefined : stats?.pending}
          icon={Clock}
          borderColor="border-l-amber-400"
          iconColor="text-amber-500"
        />
        <StatCard
          label={t('overview.inProgress')}
          value={statsPending ? undefined : stats?.inProgress}
          icon={Loader2}
          borderColor="border-l-blue-400"
          iconColor="text-blue-500"
        />
        <StatCard
          label={t('overview.resolved')}
          value={statsPending ? undefined : stats?.resolved}
          icon={CheckCircle2}
          borderColor="border-l-green-400"
          iconColor="text-green-500"
        />
      </div>

      {/* Recent pending reports */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{t('overview.pendingReports')}</h3>
          <Link href="/dashboard/it/reports">
            <Button variant="outline" size="sm" className="gap-1.5">
              {t('overview.viewAll')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {reportsPending ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : pendingReports.length === 0 ? (
          <Card className="flex flex-col items-center justify-center bg-white py-12 text-center">
            <CheckCircle2 className="mb-3 h-10 w-10 text-green-500" />
            <p className="font-semibold">{t('overview.allCaughtUp')}</p>
            <p className="text-muted-foreground mt-1 text-sm">{t('overview.noPendingDesc')}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingReports.map((report) => (
              <PendingReportRow
                key={report.id}
                report={report}
                isPending={updateStatus.isPending && updateStatus.variables?.id === report.id}
                onAction={() =>
                  updateStatus.mutate({ id: report.id, payload: { status: 'IN_PROGRESS' } })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick links to other sections */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/dashboard/it/reports?status=IN_PROGRESS">
          <Card className="cursor-pointer bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">{t('overview.inProgress')}</p>
                <p className="text-muted-foreground text-sm">
                  {t('overview.inProgressCount', { count: stats?.inProgress ?? '—' })}
                </p>
              </div>
              <ArrowRight className="text-muted-foreground ml-auto h-5 w-5" />
            </div>
          </Card>
        </Link>
        <Link href="/dashboard/it/reports?status=RESOLVED">
          <Card className="cursor-pointer bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">{t('overview.resolved')}</p>
                <p className="text-muted-foreground text-sm">
                  {t('overview.resolvedCount', { count: stats?.resolved ?? '—' })}
                </p>
              </div>
              <ArrowRight className="text-muted-foreground ml-auto h-5 w-5" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
