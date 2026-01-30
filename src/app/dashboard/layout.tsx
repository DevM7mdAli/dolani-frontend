import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { JSX } from 'react';

import DolaniHeader from '@/components/layout/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for managing the application',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <section>
      <DolaniHeader />
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</div>
    </section>
  );
}
