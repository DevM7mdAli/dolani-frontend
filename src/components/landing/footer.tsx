'use client';

import type { LandingPage } from '@/payload-types';
import { Database, Flame, MapPin, Server, Smartphone } from 'lucide-react';

export function Footer({ data }: { data: LandingPage['footer'] }) {
  return (
    <footer className="bg-primary text-primary-foreground border-primary-foreground/10 border-t py-16">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-12 md:flex-row">
          {/* Brand Column */}
          <div className="max-w-xs">
            <div className="mb-6 flex items-center gap-2">
              <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full">
                <MapPin className="text-secondary-foreground h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight">{data.logoText}</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">{data.description}</p>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-16 sm:flex-row md:gap-24">
            <div>
              <h4 className="mb-6 text-lg font-bold">{data.quickLinksTitle}</h4>
              <nav className="flex flex-col gap-4">
                {data.quickLinks?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="text-primary-foreground/70 hover:text-secondary text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">{data.resourcesTitle}</h4>
              <nav className="flex flex-col gap-4">
                {data.resources?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="text-primary-foreground/70 hover:text-secondary text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-primary-foreground/10 flex flex-col items-center gap-8 border-t pt-12">
          {/* Tech Icons */}
          <div className="flex items-center gap-4 opacity-50 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
            <div className="rounded-lg border border-white/10 bg-white/5 p-2">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-2">
              <Server className="h-5 w-5" />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-2">
              <Database className="h-5 w-5" />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-2">
              <Flame className="h-5 w-5" />
            </div>
          </div>

          <div className="text-primary-foreground/40 text-center text-xs font-medium tracking-wide">
            {data.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
