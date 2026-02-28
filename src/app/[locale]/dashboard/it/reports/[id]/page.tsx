'use client';

import React from 'react';

import { useReportDetail, useUpdateReportStatus } from '@/hooks/useIT';
import { useRouter } from '@/i18n/routing';
import type { ReportCategory, ReportStatus } from '@/types/faculty';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
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
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { getInitials } from '@/lib/get-initials';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const categoryIcons: Record<ReportCategory, React.ReactNode> = {
  PROJECTOR: <Tv className="h-4 w-4" />,
  SMART_BOARD: <Monitor className="h-4 w-4" />,
  COMPUTER: <Monitor className="h-4 w-4" />,
  PRINTER: <Printer className="h-4 w-4" />,
  AC: <Snowflake className="h-4 w-4" />,
  LIGHT: <Lightbulb className="h-4 w-4" />,
  DOOR: <DoorOpen className="h-4 w-4" />,
  PLUG: <Plug className="h-4 w-4" />,
  CLEANLINESS: <Sparkles className="h-4 w-4" />,
  SAFETY: <Shield className="h-4 w-4" />,
  OTHER: <HelpCircle className="h-4 w-4" />,
};

const statusVisuals: Record<ReportStatus, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  RESOLVED: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">{value ?? '—'}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ITReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const t = useTranslations('IT');
  const locale = useLocale();
  const id = Number(params.id);
  const { data: report, isPending, isError } = useReportDetail(id);
  const updateStatus = useUpdateReportStatus();

  const handleAction = (status: 'IN_PROGRESS' | 'RESOLVED') => {
    updateStatus.mutate({ id, payload: { status } });
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 pt-4">
        <div className="h-8 w-1/3 animate-pulse rounded bg-gray-100" />
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-56 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (isError || !report) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-24 text-center">
        <FileText className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">{t('detail.reportNotFound')}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{t('detail.reportNotFoundDesc')}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('detail.backToReports')}
        </Button>
      </div>
    );
  }

  const cat = categoryIcons[report.category];
  const sv = statusVisuals[report.status];
  const initials = getInitials(report.professor.full_name);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button */}
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        {t('detail.backToReports')}
      </Button>

      {/* Report header card */}
      <Card className="bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{report.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                {cat}
                {t(`categories.${report.category}` as `categories.${ReportCategory}`)}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${sv.bg} ${sv.text}`}
              >
                <span className={`h-2 w-2 rounded-full ${sv.dot}`} />
                {t(`statuses.${report.status}` as `statuses.${ReportStatus}`)}
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0">
            {report.status === 'PENDING' && (
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                disabled={updateStatus.isPending}
                onClick={() => handleAction('IN_PROGRESS')}
              >
                {updateStatus.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t('detail.startWorking')}
              </Button>
            )}
            {report.status === 'IN_PROGRESS' && (
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={updateStatus.isPending}
                onClick={() => handleAction('RESOLVED')}
              >
                {updateStatus.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t('detail.markResolved')}
              </Button>
            )}
            {report.status === 'RESOLVED' && (
              <Button disabled className="cursor-default bg-green-100 text-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('detail.resolvedBtn')}
              </Button>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-5 text-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {report.room}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {t('detail.submitted')} {formatDate(report.createdAt, locale)}
          </span>
        </div>
      </Card>

      {/* Description */}
      <Card className="bg-white p-6">
        <h3 className="mb-3 font-semibold">{t('detail.description')}</h3>
        <p className="text-sm leading-relaxed text-gray-700">{report.description}</p>
      </Card>

      {/* Professor info */}
      <Card className="bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-4 ring-sky-100">
            {initials}
          </div>
          <div>
            <h3 className="font-bold">{report.professor.full_name}</h3>
            <p className="text-muted-foreground text-sm">{t('detail.submittedByMember')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <InfoField label={t('detail.department')} value={report.professor.department?.name} />
          <InfoField label={t('detail.email')} value={report.professor.email} />
          <InfoField label={t('detail.phone')} value={report.professor.phone_number} />
          <InfoField
            label={t('detail.officeRoom')}
            value={report.professor.office?.room_number ?? report.professor.office?.name ?? null}
          />
        </div>
      </Card>

      {/* Resolution info (RESOLVED only) */}
      {report.status === 'RESOLVED' && report.resolved_by && (
        <Card className="border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div className="space-y-1">
              <p className="font-semibold text-green-800">{t('detail.reportResolved')}</p>
              <p className="text-sm text-green-700">
                {t('detail.resolvedBy')}{' '}
                <span className="font-medium">{report.resolved_by.user.name}</span> (
                {report.resolved_by.user.email})
              </p>
              {report.resolved_at && (
                <p className="text-sm text-green-700">
                  {t('detail.resolvedOn')} {formatDate(report.resolved_at, locale)}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
