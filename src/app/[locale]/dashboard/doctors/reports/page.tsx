'use client';

import { useState } from 'react';

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
    category: 'PROJECTOR',
    status: 'PENDING',
    room: 'A11-201',
    created_at: '2026-02-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'AC blowing warm air',
    description:
      'The AC unit in my office has been blowing warm air for the past 3 days. Temperature is uncomfortable for office hours.',
    category: 'AC',
    status: 'IN_PROGRESS',
    room: 'A11-305',
    created_at: '2026-02-12T08:15:00Z',
  },
  {
    id: 3,
    title: 'Broken door lock',
    description:
      'The electronic card reader on Lab B-102 is not recognizing faculty key cards. Had to prop the door open during class.',
    category: 'DOOR',
    status: 'RESOLVED',
    room: 'B-102',
    created_at: '2026-02-05T14:00:00Z',
    resolved_at: '2026-02-08T11:00:00Z',
  },
  {
    id: 4,
    title: 'Broken power outlet',
    description:
      'Two of the power outlets near the front desk are not working. Students cannot charge their laptops.',
    category: 'PLUG',
    status: 'PENDING',
    room: 'A11-108',
    created_at: '2026-02-16T09:45:00Z',
  },
];

/* ── Category config ── */
type CategoryGroup = { label: string; items: ReportCategory[] };

const categoryGroups: CategoryGroup[] = [
  { label: 'Tech', items: ['PROJECTOR', 'SMART_BOARD', 'COMPUTER', 'PRINTER'] },
  { label: 'Facility', items: ['AC', 'LIGHT', 'DOOR', 'PLUG'] },
  { label: 'General', items: ['CLEANLINESS', 'SAFETY', 'OTHER'] },
];

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
  const [category, setCategory] = useState<ReportCategory>('PROJECTOR');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = title.trim() && room.trim() && description.trim();

  return (
    <Card className="bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="text-primary h-5 w-5" />
        <h3 className="text-lg font-bold">New Report</h3>
      </div>

      <div className="space-y-5">
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

        {/* Category — grouped */}
        <div>
          <Label className="mb-2 block text-sm font-medium">Category</Label>
          <div className="space-y-3">
            {categoryGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((cat) => {
                    const meta = categoryMeta[cat];
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
                        {meta.icon}
                        {meta.label}
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
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-1.5 h-4 w-4" />
            Cancel
          </Button>
          <Button
            className="bg-amber-500 text-white hover:bg-amber-600"
            disabled={!canSubmit}
            onClick={() => {
              if (canSubmit) onSubmit();
            }}
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
  const meta = categoryMeta[report.category];

  return (
    <Card className="bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{report.title}</h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
              {meta.icon}
              {meta.label}
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
export default function ReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [reports] = useState<Report[]>(mockReports);

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
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
