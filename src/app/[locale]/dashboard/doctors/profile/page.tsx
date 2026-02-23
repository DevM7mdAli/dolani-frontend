'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';

import { facultyApi } from '@/lib/api/faculty';
import { getInitials } from '@/lib/get-initials';

export default function ProfilePage() {
  const t = useTranslations('Faculty');
  const { data: profile, isLoading } = useQuery({
    queryKey: ['faculty', 'profile'],
    queryFn: facultyApi.getMyProfile,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">{t('profile.loadingProfile')}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">{t('profile.profileNotFound')}</div>
      </div>
    );
  }

  const initials = getInitials(profile.full_name);

  return (
    <div className="flex items-center justify-center pt-32">
      <Card className="w-full max-w-4xl bg-white p-8">
        <h3 className="text-xl font-bold">{t('profile.personalInformation')}</h3>

        {/* Avatar + Name */}
        <div className="mt-8 flex items-center gap-5">
          <div className="bg-primary text-primary-foreground flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold ring-4 ring-sky-100">
            {initials}
          </div>
          <div>
            <p className="text-xl font-bold">{profile.full_name}</p>
          </div>
        </div>

        {/* Info Fields — 2 columns */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold">{t('profile.fullName')}</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.full_name}
            </div>
          </div>

          {/* Title — field not in DB schema yet, will always show '—' until added */}
          <div>
            <label className="mb-2 block text-sm font-semibold">{t('profile.titleLabel')}</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.title ?? '—'}
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="mb-2 block text-sm font-semibold">{t('profile.department')}</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.department?.name ?? '—'}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold">{t('profile.email')}</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.email}
            </div>
          </div>

          {/* Office Room */}
          <div>
            <label className="mb-2 block text-sm font-semibold">{t('profile.officeRoom')}</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.office?.room_number ?? profile.office?.name ?? '—'}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold">{t('profile.statusLabel')}</label>
            <div className="rounded-sm bg-sky-50 px-4 py-3 text-sm text-gray-700">
              {profile.status}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
