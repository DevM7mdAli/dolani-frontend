'use client';

import { useEffect, useState } from 'react';

import { useSchedule, useUpsertSchedule } from '@/hooks/useFaculty';
import type { DayOfWeek } from '@/types/faculty';
import { Clock, Loader2, MapPin, Pencil, Plus, Save, Trash2, Users, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/* ── Work-week days to display ── */
const weekDays: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];

/* ── Edit row type ── */
interface EditSlot {
  course_code: string;
  course_name: string;
  course_name_ar: string;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
  room: string;
  student_count: string;
}

const inputClass =
  'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30';

export default function SchedulePage() {
  const t = useTranslations('Faculty');
  const { data: schedule = [], isPending, isError } = useSchedule();
  const upsertSchedule = useUpsertSchedule();

  const [isEditing, setIsEditing] = useState(false);
  const [editSlots, setEditSlots] = useState<EditSlot[]>([]);

  /* Group slots by day */
  const slotsByDay = weekDays.map((day) => ({
    day,
    slots: schedule.filter((s) => s.day === day),
  }));

  const handleEditClick = () => {
    setEditSlots(
      schedule.map((s) => ({
        course_code: s.course_code,
        course_name: s.course_name,
        course_name_ar: s.course_name_ar ?? '',
        day: s.day,
        start_time: s.start_time,
        end_time: s.end_time,
        room: s.room,
        student_count: String(s.student_count),
      })),
    );
    setIsEditing(true);
  };

  // Close edit mode after a successful save
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (upsertSchedule.isSuccess) setIsEditing(false);
  }, [upsertSchedule.isSuccess]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditSlots([]);
  };

  const handleSave = () => {
    upsertSchedule.mutate({
      slots: editSlots.map((s) => ({
        course_code: s.course_code,
        course_name: s.course_name,
        course_name_ar: s.course_name_ar || undefined,
        day: s.day,
        start_time: s.start_time,
        end_time: s.end_time,
        room: s.room,
        student_count: Number(s.student_count),
      })),
    });
  };

  const updateSlot = (index: number, field: keyof EditSlot, value: string) => {
    setEditSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const removeSlot = (index: number) => {
    setEditSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const addSlotToDay = (day: DayOfWeek) => {
    setEditSlots((prev) => [
      ...prev,
      {
        course_code: '',
        course_name: '',
        course_name_ar: '',
        day,
        start_time: '',
        end_time: '',
        room: '',
        student_count: '',
      },
    ]);
  };

  /* Group edit slots by day (preserving global index for updates) */
  const editSlotsByDay = weekDays.map((day) => ({
    day,
    slots: editSlots.map((s, i) => ({ ...s, globalIndex: i })).filter((s) => s.day === day),
  }));

  if (isError) {
    return (
      <div className="flex justify-center pt-10">
        <div className="w-full max-w-4xl">
          <Card className="flex flex-col items-center justify-center bg-white py-20 text-center">
            <p className="text-destructive font-semibold">Failed to load schedule.</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Please refresh the page and try again.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-10">
      <div className="w-full max-w-4xl">
        <Card className="bg-white p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{t('schedulePage.editSchedule')}</h3>
            {!isEditing && (
              <Button
                variant="default"
                size="sm"
                className="gap-2 rounded-sm"
                onClick={handleEditClick}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
                {t('schedulePage.editSchedule')}
              </Button>
            )}
          </div>

          {isEditing ? (
            /* ── Edit Mode ── */
            <div className="mt-8 space-y-8">
              {editSlotsByDay.map(({ day, slots }) => {
                const label = t(`days.${day}`);
                return (
                  <div key={day}>
                    {/* Day header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="font-bold">{label}</h4>
                    </div>

                    {/* Editable class cards */}
                    <div className="mt-3 space-y-4">
                      {slots.map((slot) => (
                        <div
                          key={slot.globalIndex}
                          className="border-l-primary rounded-xl border-l-4 bg-sky-50 p-5"
                        >
                          {/* Row 1: Course Code + Course Name (English) */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-primary mb-1.5 block text-xs font-semibold">
                                {t('schedulePage.courseCode')}
                              </label>
                              <input
                                type="text"
                                value={slot.course_code}
                                onChange={(e) =>
                                  updateSlot(slot.globalIndex, 'course_code', e.target.value)
                                }
                                className={inputClass}
                                placeholder={t('schedulePage.courseCodePlaceholder')}
                              />
                            </div>
                            <div>
                              <label className="text-primary mb-1.5 block text-xs font-semibold">
                                {t('schedulePage.courseNameEnglish')}
                              </label>
                              <input
                                type="text"
                                value={slot.course_name}
                                onChange={(e) =>
                                  updateSlot(slot.globalIndex, 'course_name', e.target.value)
                                }
                                className={inputClass}
                                placeholder={t('schedulePage.courseNameEnPlaceholder')}
                              />
                            </div>
                          </div>

                          {/* Row 2: Course Name (Arabic) */}
                          <div className="mt-3">
                            <label className="text-primary mb-1.5 block text-xs font-semibold">
                              {t('schedulePage.courseNameArabic')}
                            </label>
                            <input
                              type="text"
                              dir="rtl"
                              value={slot.course_name_ar}
                              onChange={(e) =>
                                updateSlot(slot.globalIndex, 'course_name_ar', e.target.value)
                              }
                              className={inputClass}
                              placeholder="اسم المادة بالعربي"
                            />
                          </div>

                          {/* Row 3: Day + Start Time */}
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-primary mb-1.5 block text-xs font-semibold">
                                {t('schedulePage.day')}
                              </label>
                              <select
                                value={slot.day}
                                onChange={(e) =>
                                  updateSlot(slot.globalIndex, 'day', e.target.value)
                                }
                                className={inputClass}
                              >
                                {weekDays.map((d) => (
                                  <option key={d} value={d}>
                                    {t(`days.${d}`)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-primary mb-1.5 block text-xs font-semibold">
                                {t('schedulePage.startTime')}
                              </label>
                              <input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) =>
                                  updateSlot(slot.globalIndex, 'start_time', e.target.value)
                                }
                                className={inputClass}
                              />
                            </div>
                          </div>

                          {/* Row 4: End Time + Room */}
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-primary mb-1.5 block text-xs font-semibold">
                                {t('schedulePage.endTime')}
                              </label>
                              <input
                                type="time"
                                value={slot.end_time}
                                onChange={(e) =>
                                  updateSlot(slot.globalIndex, 'end_time', e.target.value)
                                }
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="text-primary mb-1.5 block text-xs font-semibold">
                                {t('schedulePage.room')}
                              </label>
                              <input
                                type="text"
                                value={slot.room}
                                onChange={(e) =>
                                  updateSlot(slot.globalIndex, 'room', e.target.value)
                                }
                                className={inputClass}
                                placeholder={t('schedulePage.roomPlaceholder')}
                              />
                            </div>
                          </div>

                          {/* Row 5: Number of Students */}
                          <div className="mt-3 w-1/2 pr-2">
                            <label className="text-primary mb-1.5 block text-xs font-semibold">
                              {t('schedulePage.numberOfStudents')}
                            </label>
                            <input
                              type="number"
                              value={slot.student_count}
                              onChange={(e) =>
                                updateSlot(slot.globalIndex, 'student_count', e.target.value)
                              }
                              className={inputClass}
                              placeholder="0"
                              min="0"
                            />
                          </div>

                          {/* Remove button */}
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeSlot(slot.globalIndex)}
                              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                              {t('schedulePage.removeClass')}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add class to day */}
                      <button
                        type="button"
                        onClick={() => addSlotToDay(day)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                        {t('schedulePage.addClass')} {label}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                  {t('schedulePage.cancel')}
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-amber-400 text-white hover:bg-amber-500"
                  onClick={handleSave}
                  disabled={upsertSchedule.isPending}
                >
                  {upsertSchedule.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {upsertSchedule.isPending ? t('schedulePage.saving') : t('schedulePage.saveChanges')}
                </Button>
              </div>
            </div>
          ) : (
            /* ── Read-Only Mode ── */
            <div className="mt-8 space-y-6">
              {slotsByDay.map(({ day, slots }) => {
                const label = t(`days.${day}`);
                return (
                  <div key={day}>
                    {/* Day header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="font-bold">{label}</h4>
                    </div>

                    {/* Slots or empty */}
                    <div className="mt-3 space-y-3">
                      {slots.length === 0 ? (
                        <div className="flex h-12 items-center justify-center rounded-lg bg-sky-50 text-sm text-gray-400">
                          {t('schedulePage.noSchedule')}
                        </div>
                      ) : (
                        slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="border-l-primary rounded-lg border-l-4 bg-sky-50 px-5 py-4"
                          >
                            {/* Course name row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="bg-primary text-primary-foreground rounded-full px-3 py-0.5 text-xs font-semibold">
                                  {slot.course_code}
                                </span>
                                <span className="font-semibold">{slot.course_name}</span>
                              </div>
                            </div>

                            {/* Details row */}
                            <div className="mt-2 flex items-center gap-5 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {slot.start_time} - {slot.end_time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {slot.room}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {slot.student_count} {t('schedulePage.students')}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
