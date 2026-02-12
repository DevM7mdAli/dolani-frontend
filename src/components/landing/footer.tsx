'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Landing.footer');

  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-400">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="text-sm">{t('copyright')}</div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="transition-colors hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
