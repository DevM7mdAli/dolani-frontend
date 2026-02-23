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

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { getInitials } from '@/lib/get-initials';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const categoryMeta: Record<ReportCategory, { label: string; icon: React.ReactNode }> = {
  PROJECTOR: { label: 'Projector', icon: <Tv className="h-4 w-4" /> },
  SMART_BOARD: { label: 'Smart Board', icon: <Monitor className="h-4 w-4" /> },
  COMPUTER: { label: 'Computer', icon: <Monitor className="h-4 w-4" /> },
  PRINTER: { label: 'Printer', icon: <Printer className="h-4 w-4" /> },
  AC: { label: 'AC', icon: <Snowflake className="h-4 w-4" /> },
  LIGHT: { label: 'Light', icon: <Lightbulb className="h-4 w-4" /> },
  DOOR: { label: 'Door', icon: <DoorOpen className="h-4 w-4" /> },
  PLUG: { label: 'Power Outlet', icon: <Plug className="h-4 w-4" /> },
  CLEANLINESS: { label: 'Cleanliness', icon: <Sparkles className="h-4 w-4" /> },
  SAFETY: { label: 'Safety', icon: <Shield className="h-4 w-4" /> },
  OTHER: { label: 'Other', icon: <HelpCircle className="h-4 w-4" /> },
};

const statusConfig: Record<ReportStatus, { label: string; bg: string; text: string; dot: string }> =
  {
    PENDING: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
    },
    RESOLVED: {
      label: 'Resolved',
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500',
    },
  };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
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
        <h3 className="text-lg font-semibold">Report not found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          This report may have been deleted or the ID is invalid.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
      </div>
    );
  }

  const cat = categoryMeta[report.category];
  const status = statusConfig[report.status];
  const initials = getInitials(report.professor.full_name);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button */}
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </Button>

      {/* Report header card */}
      <Card className="bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{report.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                {cat.icon}
                {cat.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${status.bg} ${status.text}`}
              >
                <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                {status.label}
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
                Start Working
              </Button>
            )}
            {report.status === 'IN_PROGRESS' && (
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={updateStatus.isPending}
                onClick={() => handleAction('RESOLVED')}
              >
                {updateStatus.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mark as Resolved
              </Button>
            )}
            {report.status === 'RESOLVED' && (
              <Button disabled className="cursor-default bg-green-100 text-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Resolved
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
            Submitted {formatDate(report.createdAt)}
          </span>
        </div>
      </Card>

      {/* Description */}
      <Card className="bg-white p-6">
        <h3 className="mb-3 font-semibold">Description</h3>
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
            <p className="text-muted-foreground text-sm">Report submitted by this faculty member</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <InfoField label="Department" value={report.professor.department?.name} />
          <InfoField label="Email" value={report.professor.email} />
          <InfoField label="Phone" value={report.professor.phone_number} />
          <InfoField
            label="Office Room"
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
              <p className="font-semibold text-green-800">Report Resolved</p>
              <p className="text-sm text-green-700">
                Resolved by <span className="font-medium">{report.resolved_by.user.name}</span> (
                {report.resolved_by.user.email})
              </p>
              {report.resolved_at && (
                <p className="text-sm text-green-700">
                  Resolved on {formatDate(report.resolved_at)}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
