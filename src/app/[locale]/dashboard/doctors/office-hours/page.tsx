'use client';

import { useState } from 'react';

import type { DayOfWeek } from '@/types/faculty';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { facultyApi } from '@/lib/api/faculty';

const allDays: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const dayLabels: Record<DayOfWeek, { en: string; ar: string }> = {
  SUNDAY: { en: 'Sunday', ar: 'الأحد' },
  MONDAY: { en: 'Monday', ar: 'الاثنين' },
  TUESDAY: { en: 'Tuesday', ar: 'الثلاثاء' },
  WEDNESDAY: { en: 'Wednesday', ar: 'الأربعاء' },
  THURSDAY: { en: 'Thursday', ar: 'الخميس' },
  FRIDAY: { en: 'Friday', ar: 'الجمعة' },
  SATURDAY: { en: 'Saturday', ar: 'السبت' },
};

interface EditRow {
  day: DayOfWeek | '';
  start_time: string;
  end_time: string;
}

export default function OfficeHoursPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editRows, setEditRows] = useState<EditRow[]>([]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['faculty', 'profile'],
    queryFn: facultyApi.getMyProfile,
  });

  const { mutate: saveOfficeHours, isPending: isSaving } = useMutation({
    mutationFn: (rows: EditRow[]) => {
      const valid = rows.filter((r) => r.day && r.start_time && r.end_time);
      return facultyApi.updateOfficeHours(
        valid.map((r) => ({
          day: r.day as string,
          start_time: r.start_time,
          end_time: r.end_time,
        })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty', 'profile'] });
      setIsEditing(false);
      toast.success('Office hours updated successfully');
    },
    onError: () => {
      toast.error('Failed to update office hours');
    },
  });

  const handleEditClick = () => {
    const existing = profile?.office_hours ?? [];
    setEditRows(
      existing.length > 0
        ? existing.map((oh) => ({ day: oh.day, start_time: oh.start_time, end_time: oh.end_time }))
        : [{ day: '', start_time: '', end_time: '' }],
    );
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditRows([]);
  };

  const updateRow = (index: number, field: keyof EditRow, value: string) => {
    setEditRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const deleteRow = (index: number) => {
    setEditRows((prev) => prev.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setEditRows((prev) => [...prev, { day: '', start_time: '', end_time: '' }]);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading office hours...</div>
      </div>
    );
  }

  const officeHours = profile?.office_hours ?? [];

  return (
    <div className="flex justify-center pt-10">
      <div className="w-full max-w-4xl space-y-6">
        {/* Office Hours Card */}
        <Card className="bg-white p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">My Office Hours</h3>
            {!isEditing && (
              <Button
                variant="default"
                size="sm"
                className="gap-2 rounded-sm"
                onClick={handleEditClick}
              >
                <Pencil className="h-4 w-4" />
                Edit Hours
              </Button>
            )}
          </div>

          {isEditing ? (
            /* ── Edit Mode ── */
            <div className="mt-6 space-y-4">
              {editRows.map((row, index) => (
                <div key={index} className="flex items-end gap-3 rounded-xl bg-sky-50 p-5">
                  {/* Clock icon */}
                  <div className="bg-primary text-primary-foreground mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <Clock className="h-5 w-5" />
                  </div>

                  {/* Day */}
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">Day</label>
                    <select
                      value={row.day}
                      onChange={(e) => updateRow(index, 'day', e.target.value)}
                      className="focus:border-primary focus:ring-primary/30 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-1"
                    >
                      <option value=""></option>
                      {allDays.map((d) => (
                        <option key={d} value={d}>
                          {dayLabels[d].en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time */}
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={row.start_time}
                      onChange={(e) => updateRow(index, 'start_time', e.target.value)}
                      className="focus:border-primary focus:ring-primary/30 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-1"
                    />
                  </div>

                  {/* End Time */}
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={row.end_time}
                      onChange={(e) => updateRow(index, 'end_time', e.target.value)}
                      className="focus:border-primary focus:ring-primary/30 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-1"
                    />
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => deleteRow(index)}
                    className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Add Row */}
              <button
                type="button"
                onClick={addRow}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
              >
                <Plus className="h-4 w-4" />
                Add Office Hour
              </button>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-amber-400 text-white hover:bg-amber-500"
                  onClick={() => saveOfficeHours(editRows)}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            /* ── Read-Only Mode ── */
            <div className="mt-6 space-y-3">
              {officeHours.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-sm bg-sky-50 text-sm text-gray-500">
                  No office hours set yet
                </div>
              ) : (
                officeHours.map((oh) => {
                  const day = dayLabels[oh.day];
                  return (
                    <div
                      key={oh.id}
                      className="flex items-center justify-between rounded-lg bg-sky-50 px-5 py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{day.en}</p>
                          <p className="text-sm text-gray-500">
                            {oh.start_time} - {oh.end_time}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{day.ar}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </Card>

        {/* Tips Card */}
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-6">
          <h4 className="flex items-center gap-2 font-bold">
            <span>📌</span> Office Hours Tips
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Students can see your availability status in real-time through the navigation app
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Update your status when you&apos;re temporarily unavailable or in a meeting
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Regular office hours help students plan their visits effectively
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
