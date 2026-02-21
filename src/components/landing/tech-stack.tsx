'use client';

import type { LandingPage } from '@/payload-types';

export function TechStack({ data }: { data: LandingPage['techStack'] }) {
  return (
    <section id="technology" className="bg-slate-900 py-20 text-white">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 transition-opacity duration-500 hover:opacity-100 md:gap-16">
          {data.items?.map((item) => (
            <div key={item.id} className="group flex flex-col items-center gap-2">
              {/* Placeholder for Logo */}
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-2xl font-bold backdrop-blur-sm transition-all group-hover:bg-white/20"
                style={{ color: item.color }}
              >
                {item.title[0]}
              </div>
              <span className="text-sm font-medium text-slate-400 transition-colors group-hover:text-white">
                {item.title}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          {data.bottomItems?.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <span className="text-lg font-light text-slate-400 italic">
                &quot;{item.description}&quot;
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
