'use client';

import { useState } from 'react';

import { useCreateReport, useMyReports } from '@/hooks/useFaculty';
import type { Report, ReportCategory, ReportStatus } from '@/types/faculty';
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
  DoorOpen,
  FileText,
  HelpCircle,
  Lightbulb,
  Loader2,
  MapPin,
  Monitor,
  Plug,
  Plus,
  Printer,
  Send,
  Shield,
  Snowflake,
  Sparkles,
  Tv,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* ── Category config ── */
type CategoryGroup = { key: string; items: ReportCategory[] };

const categoryGroupsData: CategoryGroup[] = [
  { key: 'tech', items: ['PROJECTOR', 'SMART_BOARD', 'COMPUTER', 'PRINTER'] },
  { key: 'facility', items: ['AC', 'LIGHT', 'DOOR', 'PLUG'] },
  { key: 'general', items: ['CLEANLINESS', 'SAFETY', 'OTHER'] },
];

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

const statusStyles: Record<ReportStatus, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  IN_PROGRESS: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  RESOLVED: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ── New Report Form ── */
function NewReportForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: () => void }) {
  const t = useTranslations('Faculty');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('PROJECTOR');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const createReport = useCreateReport();

  const canSubmit = title.trim() && room.trim() && description.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    createReport.mutate(
      { title: title.trim(), description: description.trim(), category, room: room.trim() },
      { onSuccess: onSubmit },
    );
  };

  return (
    <Card className="bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="text-primary h-5 w-5" />
        <h3 className="text-lg font-bold">{t('reportsPage.newReport')}</h3>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <Label htmlFor="report-title" className="mb-1.5 block text-sm font-medium">
            {t('reportsPage.titleLabel')}
          </Label>
          <Input
            id="report-title"
            placeholder={t('reportsPage.titlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category — grouped */}
        <div>
          <Label className="mb-2 block text-sm font-medium">{t('reportsPage.category')}</Label>
          <div className="space-y-3">
            {categoryGroupsData.map((group) => (
              <div key={group.key}>
                <p className="mb-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  {t(`reportsPage.categoryGroups.${group.key}`)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((cat) => {
                    const icon = categoryIcons[cat];
                    const selected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`flex items-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                          selected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                        {t(`reportsPage.categories.${cat}`)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room */}
        <div>
          <Label htmlFor="report-room" className="mb-1.5 block text-sm font-medium">
            {t('reportsPage.roomLabel')}
          </Label>
          <Input
            id="report-room"
            placeholder={t('reportsPage.roomPlaceholder')}
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="report-description" className="mb-1.5 block text-sm font-medium">
            {t('reportsPage.description')}
          </Label>
          <textarea
            id="report-description"
            rows={4}
            placeholder={t('reportsPage.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-input bg-background placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-1.5 h-4 w-4" />
            {t('reportsPage.cancelBtn')}
          </Button>
          <Button
            className="bg-amber-500 text-white hover:bg-amber-600"
            disabled={!canSubmit || createReport.isPending}
            onClick={handleSubmit}
          >
            {createReport.isPending ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="mr-1.5 h-4 w-4" />
                {t('reportsPage.submitReport')}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ── Report Card ── */
function ReportCard({ report }: { report: Report }) {
  const t = useTranslations('Faculty');
  const [expanded, setExpanded] = useState(false);
  const status = statusStyles[report.status];
  const icon = categoryIcons[report.category];

  return (
    <Card className="bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{report.title}</h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
              {icon}
              {t(`reportsPage.categories.${report.category}`)}
            </span>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {report.room}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(report.createdAt)}
            </span>
          </div>

          {expanded && <p className="mt-1 text-sm text-gray-600">{report.description}</p>}
          {report.status === 'RESOLVED' && report.resolved_at && expanded && (
            <p className="text-xs text-green-600">Resolved on {formatDate(report.resolved_at)}</p>
          )}
        </div>

        {/* Right: status + expand */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {t(`reportsPage.statuses.${report.status}`)}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ── Loading skeleton ── */
function ReportSkeleton() {
  return (
    <Card className="bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
      </div>
    </Card>
  );
}

/* ── Page ── */
export default function ReportsPage() {
  const t = useTranslations('Faculty');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'>(
    'ALL',
  );

  const { data, isPending, isError } = useMyReports(
    statusFilter !== 'ALL' ? { status: statusFilter } : {},
  );
  const reports = data?.data ?? [];

  const statusTabs: { label: string; value: typeof statusFilter }[] = [
    { label: t('reportsPage.allReports'), value: 'ALL' },
    { label: t('reportsPage.statuses.PENDING'), value: 'PENDING' },
    { label: t('reportsPage.statuses.IN_PROGRESS'), value: 'IN_PROGRESS' },
    { label: t('reportsPage.statuses.RESOLVED'), value: 'RESOLVED' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('reportsPage.roomReports')}</h2>
          <p className="text-muted-foreground text-sm">{t('reportsPage.subtitle')}</p>
        </div>
        {!showForm && (
          <Button
            className="bg-amber-500 text-white hover:bg-amber-600"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {t('reportsPage.newReportBtn')}
          </Button>
        )}
      </div>

      {/* Status filter tabs */}
      {!showForm && (
        <div className="flex gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* New Report Form */}
      {showForm && (
        <NewReportForm onCancel={() => setShowForm(false)} onSubmit={() => setShowForm(false)} />
      )}

      {/* Error state */}
      {isError && (
        <Card className="flex flex-col items-center justify-center bg-white py-12 text-center">
          <AlertTriangle className="text-destructive mb-3 h-10 w-10" />
          <p className="font-semibold">Failed to load reports.</p>
          <p className="text-muted-foreground mt-1 text-sm">Please refresh the page.</p>
        </Card>
      )}

      {/* Loading skeletons */}
      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReportSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Reports List */}
      {!isPending && !isError && (
        <>
          {reports.length === 0 ? (
            <Card className="flex flex-col items-center justify-center bg-white py-16 text-center">
              <AlertTriangle className="text-muted-foreground mb-3 h-12 w-12" />
              <h3 className="text-lg font-semibold">{t('reportsPage.noReports')}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {statusFilter === 'ALL'
                  ? 'Click “New Report” to report a room or facility issue.'
                  : `No ${statusFilter.toLowerCase().replace('_', ' ')} reports.`}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
