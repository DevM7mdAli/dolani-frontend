'use client';

import { useTranslations } from 'next-intl';

export function TechStack() {
  const t = useTranslations('Landing.tech');

  const stack = [
    { name: 'React Native', color: '#61DAFB' },
    { name: 'NestJS', color: '#E0234E' },
    { name: 'PostgreSQL', color: '#336791' },
    { name: 'Firebase', color: '#FFCA28' },
  ];

  return (
    <section id="technology" className="bg-slate-900 py-20 text-white">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 transition-opacity duration-500 hover:opacity-100 md:gap-16">
          {stack.map((item) => (
            <div key={item.name} className="group flex flex-col items-center gap-2">
              {/* Placeholder for Logo */}
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-2xl font-bold backdrop-blur-sm transition-all group-hover:bg-white/20"
                style={{ color: item.color }}
              >
                {item.name[0]}
              </div>
              <span className="text-sm font-medium text-slate-400 transition-colors group-hover:text-white">
                {item.name}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-12 text-lg font-light text-slate-400 italic">&quot;{t('tagline')}&quot;</p>
      </div>
    </section>
  );
}
