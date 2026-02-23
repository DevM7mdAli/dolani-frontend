'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useAllReports, useUpdateReportStatus } from '@/hooks/useIT';
import { Link } from '@/i18n/routing';
import type {
  ReportCategory,
  ReportListParams,
  ReportStatus,
  ReportWithRelations,
} from '@/types/faculty';
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
  DoorOpen,
  HelpCircle,
  Lightbulb,
  Loader2,
  MapPin,
  Monitor,
  Plug,
  Printer,
  Search,
  Shield,
  Snowflake,
  Sparkles,
  Tv,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const categoryMeta: Record<ReportCategory, { label: string; icon: React.ReactNode }> = {
  PROJECTOR: { label: 'Projector', icon: <Tv className="h-3.5 w-3.5" /> },
  SMART_BOARD: { label: 'Smart Board', icon: <Monitor className="h-3.5 w-3.5" /> },
  COMPUTER: { label: 'Computer', icon: <Monitor className="h-3.5 w-3.5" /> },
  PRINTER: { label: 'Printer', icon: <Printer className="h-3.5 w-3.5" /> },
  AC: { label: 'AC', icon: <Snowflake className="h-3.5 w-3.5" /> },
  LIGHT: { label: 'Light', icon: <Lightbulb className="h-3.5 w-3.5" /> },
  DOOR: { label: 'Door', icon: <DoorOpen className="h-3.5 w-3.5" /> },
  PLUG: { label: 'Power Outlet', icon: <Plug className="h-3.5 w-3.5" /> },
  CLEANLINESS: { label: 'Cleanliness', icon: <Sparkles className="h-3.5 w-3.5" /> },
  SAFETY: { label: 'Safety', icon: <Shield className="h-3.5 w-3.5" /> },
  OTHER: { label: 'Other', icon: <HelpCircle className="h-3.5 w-3.5" /> },
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

const categoryOptions: ReportCategory[] = [
  'PROJECTOR',
  'SMART_BOARD',
  'COMPUTER',
  'PRINTER',
  'AC',
  'LIGHT',
  'DOOR',
  'PLUG',
  'CLEANLINESS',
  'SAFETY',
  'OTHER',
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Report Card ──────────────────────────────────────────────────────────────

function ReportCard({
  report,
  onStart,
  onResolve,
  isPendingStart,
  isPendingResolve,
}: {
  report: ReportWithRelations;
  onStart: () => void;
  onResolve: () => void;
  isPendingStart: boolean;
  isPendingResolve: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const cat = categoryMeta[report.category];
  const status = statusConfig[report.status];

  return (
    <Card className="bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Left content */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/dashboard/it/reports/${report.id}`}
              className="hover:text-primary font-semibold transition-colors"
            >
              {report.title}
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
              {cat.icon}
              {cat.label}
            </span>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {report.room}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {report.professor.full_name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(report.createdAt)}
            </span>
          </div>

          {/* Expanded detail */}
          {expanded && (
            <div className="space-y-2 pt-1">
              <p className="text-sm text-gray-600">{report.description}</p>
              <p className="text-muted-foreground text-xs">
                Submitted by{' '}
                <span className="font-medium text-gray-700">{report.professor.full_name}</span>
                {report.professor.department && ` · ${report.professor.department.name}`}
              </p>
              {report.status === 'RESOLVED' && report.resolved_by && (
                <p className="text-xs text-green-700">
                  Resolved by {report.resolved_by.user.name}
                  {report.resolved_at && ` on ${formatDate(report.resolved_at)}`}
                </p>
              )}
            </div>
          )}

          {/* Action buttons (when expanded) */}
          {expanded && report.status !== 'RESOLVED' && (
            <div className="pt-1">
              {report.status === 'PENDING' && (
                <Button
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  disabled={isPendingStart}
                  onClick={onStart}
                >
                  {isPendingStart ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
                  Start Working
                </Button>
              )}
              {report.status === 'IN_PROGRESS' && (
                <Button
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700"
                  disabled={isPendingResolve}
                  onClick={onResolve}
                >
                  {isPendingResolve ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Mark as Resolved
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right: Status + expand */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Card>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ReportSkeleton() {
  return (
    <Card className="bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/5 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
      </div>
    </Card>
  );
}

// ─── Status tabs ──────────────────────────────────────────────────────────────

type StatusFilter = 'ALL' | ReportStatus;

const statusTabs: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ITReportsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | ''>('');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const params: ReportListParams = {
    limit: 50,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
    ...(categoryFilter ? { category: categoryFilter } : {}),
  };

  const { data, isPending, isError } = useAllReports(params);
  const updateStatus = useUpdateReportStatus();
  const reports = data?.data ?? [];

  const handleStart = useCallback(
    (id: number) => updateStatus.mutate({ id, payload: { status: 'IN_PROGRESS' } }),
    [updateStatus],
  );
  const handleResolve = useCallback(
    (id: number) => updateStatus.mutate({ id, payload: { status: 'RESOLVED' } }),
    [updateStatus],
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, room, professor…"
            className="h-9 w-full rounded-md border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ReportCategory | '')}
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {categoryMeta[cat].label}
            </option>
          ))}
        </select>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {isError && (
        <Card className="flex flex-col items-center justify-center bg-white py-12 text-center">
          <AlertTriangle className="text-destructive mb-3 h-10 w-10" />
          <p className="font-semibold">Failed to load reports.</p>
          <p className="text-muted-foreground mt-1 text-sm">Please refresh the page.</p>
        </Card>
      )}

      {/* Skeletons */}
      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ReportSkeleton key={i} />
          ))}
        </div>
      )}

      {/* List */}
      {!isPending && !isError && (
        <>
          {reports.length === 0 ? (
            <Card className="flex flex-col items-center justify-center bg-white py-16 text-center">
              <AlertTriangle className="text-muted-foreground mb-3 h-12 w-12" />
              <h3 className="text-lg font-semibold">No reports found</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {statusFilter === 'ALL' && !debouncedSearch
                  ? 'No reports have been submitted yet.'
                  : 'Try adjusting your filters or search term.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onStart={() => handleStart(report.id)}
                  onResolve={() => handleResolve(report.id)}
                  isPendingStart={
                    updateStatus.isPending &&
                    updateStatus.variables?.id === report.id &&
                    updateStatus.variables?.payload.status === 'IN_PROGRESS'
                  }
                  isPendingResolve={
                    updateStatus.isPending &&
                    updateStatus.variables?.id === report.id &&
                    updateStatus.variables?.payload.status === 'RESOLVED'
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
