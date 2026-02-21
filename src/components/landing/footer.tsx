'use client';

import type { LandingPage } from '@/payload-types';

export function Footer({ data }: { data: LandingPage['footer'] }) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-400">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="text-sm">{data.copyright}</div>
        <div className="flex gap-6 text-sm">
          {data.quickLinks?.map((link) => (
            <a key={link.id} href={link.url} className="transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
          {data.resources?.map((link) => (
            <a key={link.id} href={link.url} className="transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
