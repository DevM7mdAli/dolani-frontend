'use client';

import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';

import { facultyApi } from '@/lib/api/faculty';
import { getInitials } from '@/lib/get-initials';

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['faculty', 'profile'],
    queryFn: facultyApi.getMyProfile,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Profile not found</div>
      </div>
    );
  }

  const initials = getInitials(profile.full_name);

  return (
    <div className="flex items-center justify-center pt-32">
      <Card className="w-full max-w-4xl bg-white p-8">
        <h3 className="text-xl font-bold">Personal Information</h3>

        {/* Avatar + Name */}
        <div className="mt-8 flex items-center gap-5">
          <div className="bg-primary text-primary-foreground flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold ring-4 ring-sky-100">
            {initials}
          </div>
          <div>
            <p className="text-xl font-bold">{profile.full_name}</p>
            <p className="text-muted-foreground mt-1 text-sm">{profile.full_name_ar ?? '—'}</p>
          </div>
        </div>

        {/* Info Fields — 2 columns: English (left), Arabic (right) */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {/* Full Name (English) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Full Name (English)</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.full_name}
            </div>
          </div>
          {/* Full Name (Arabic) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Full Name (Arabic)</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700" dir="rtl">
              {profile.full_name_ar ?? '—'}
            </div>
          </div>

          {/* Title (English) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Title (English)</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.title ?? '—'}
            </div>
          </div>
          {/* Title (Arabic) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Title (Arabic)</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700" dir="rtl">
              {profile.title_ar ?? '—'}
            </div>
          </div>

          {/* Department (English) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Department (English)</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.department?.name ?? '—'}
            </div>
          </div>
          {/* Department (Arabic) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Department (Arabic)</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700" dir="rtl">
              {profile.department?.name_ar ?? '—'}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.email}
            </div>
          </div>
          {/* Office Room */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Office Room</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.office?.room_number ?? profile.office?.name ?? '—'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
