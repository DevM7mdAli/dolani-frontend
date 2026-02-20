import { redirect } from 'next/navigation';

import { getLocale } from 'next-intl/server';

export default async function FacultyPage() {
  const locale = await getLocale();
  redirect(`/${locale}/dashboard/doctors/profile`);
}
