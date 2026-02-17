'use client';

import { useState } from 'react';

import type { Report, ReportCategory, ReportStatus } from '@/types/faculty';
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  HelpCircle,
  MapPin,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* ── Mock data ── */
const mockReports: Report[] = [
  {
    id: 1,
    title: 'Projector not working',
    description:
      'The ceiling-mounted projector in Room A11-201 has stopped displaying. The lamp turns on but shows a blank blue screen. Tried multiple HDMI cables.',
    category: 'EQUIPMENT',
    status: 'PENDING',
    room: 'A11-201',
    created_at: '2026-02-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Air conditioning malfunction',
    description:
      'The AC unit in my office has been blowing warm air for the past 3 days. Temperature is uncomfortable for office hours.',
    category: 'MAINTENANCE',
    status: 'IN_PROGRESS',
    room: 'A11-305',
    created_at: '2026-02-12T08:15:00Z',
  },
  {
    id: 3,
    title: 'Broken door lock',
    description:
      'The electronic card reader on Lab B-102 is not recognizing faculty key cards. Had to prop the door open during class.',
    category: 'SAFETY',
    status: 'RESOLVED',
    room: 'B-102',
    created_at: '2026-02-05T14:00:00Z',
    resolved_at: '2026-02-08T11:00:00Z',
  },
  {
    id: 4,
    title: 'Water leak near whiteboard',
    description:
      'There is a slow water leak from the ceiling tiles near the front whiteboard. The floor gets slippery and it may damage equipment.',
    category: 'MAINTENANCE',
    status: 'PENDING',
    room: 'A11-108',
    created_at: '2026-02-16T09:45:00Z',
  },
];

/* ── Helpers ── */
const categoryLabels: Record<ReportCategory, string> = {
  MAINTENANCE: 'Maintenance',
  EQUIPMENT: 'Equipment',
  SAFETY: 'Safety',
  CLEANLINESS: 'Cleanliness',
  OTHER: 'Other',
};

const categoryIcons: Record<ReportCategory, React.ReactNode> = {
  MAINTENANCE: <Wrench className="h-3.5 w-3.5" />,
  EQUIPMENT: <Zap className="h-3.5 w-3.5" />,
  SAFETY: <ShieldAlert className="h-3.5 w-3.5" />,
  CLEANLINESS: <Sparkles className="h-3.5 w-3.5" />,
  OTHER: <HelpCircle className="h-3.5 w-3.5" />,
};

const statusConfig: Record<ReportStatus, { label: string; bg: string; text: string; dot: string }> =
  {
    PENDING: {
      label: 'Pending',
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
    },
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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ── New Report Form ── */
function NewReportForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('MAINTENANCE');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = title.trim() && room.trim() && description.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: Call API when backend is ready
    onSubmit();
  };

  return (
    <Card className="bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="text-primary h-5 w-5" />
        <h3 className="text-lg font-bold">New Report</h3>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="report-title" className="mb-1.5 block text-sm font-medium">
            Title
          </Label>
          <Input
            id="report-title"
            placeholder="Brief description of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Category</Label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(categoryLabels) as ReportCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {categoryIcons[cat]}
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Room */}
        <div>
          <Label htmlFor="report-room" className="mb-1.5 block text-sm font-medium">
            Room
          </Label>
          <Input
            id="report-room"
            placeholder="e.g., A11-201"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="report-description" className="mb-1.5 block text-sm font-medium">
            Description
          </Label>
          <textarea
            id="report-description"
            rows={4}
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-input bg-background placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-1.5 h-4 w-4" />
            Cancel
          </Button>
          <Button
            className="bg-amber-500 text-white hover:bg-amber-600"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            <Send className="mr-1.5 h-4 w-4" />
            Submit Report
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ── Report Card ── */
function ReportCard({ report }: { report: Report }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[report.status];

  return (
    <Card className="bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{report.title}</h4>
            {/* Category badge */}
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700">
              {categoryIcons[report.category]}
              {categoryLabels[report.category]}
            </span>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {report.room}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(report.created_at)}
            </span>
          </div>

          {/* Expandable description */}
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
            {status.label}
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

/* ── Page ── */
const REPORTS_PER_PAGE = 5;

export default function ReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [reports] = useState<Report[]>(mockReports);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reports.length / REPORTS_PER_PAGE);
  const paginatedReports = reports.slice(
    (currentPage - 1) * REPORTS_PER_PAGE,
    currentPage * REPORTS_PER_PAGE,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Reports</h2>
          <p className="text-muted-foreground text-sm">
            Report and track facility issues in your rooms
          </p>
        </div>
        {!showForm && (
          <Button
            className="bg-amber-500 text-white hover:bg-amber-600"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Report
          </Button>
        )}
      </div>

      {/* New Report Form */}
      {showForm && (
        <NewReportForm onCancel={() => setShowForm(false)} onSubmit={() => setShowForm(false)} />
      )}

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card className="flex flex-col items-center justify-center bg-white py-16 text-center">
          <AlertTriangle className="text-muted-foreground mb-3 h-12 w-12" />
          <h3 className="text-lg font-semibold">No reports submitted yet</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Click &quot;New Report&quot; to report a room or facility issue.
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-muted-foreground text-sm">
                Showing {(currentPage - 1) * REPORTS_PER_PAGE + 1}–
                {Math.min(currentPage * REPORTS_PER_PAGE, reports.length)} of {reports.length}{' '}
                reports
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="icon"
                    className={`h-8 w-8 ${
                      page === currentPage ? 'bg-amber-500 text-white hover:bg-amber-600' : ''
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
