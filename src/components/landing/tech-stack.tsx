'use client';

import type { LandingPage } from '@/payload-types';
import { Bluetooth, Code2, Database, Flame, Server, Shield, Smartphone } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Smartphone: Smartphone,
  Server: Server,
  Database: Database,
  Flame: Flame,
  Bluetooth: Bluetooth,
  Code2: Code2,
  Shield: Shield,
};

export function TechStack({ data }: { data: LandingPage['techStack'] }) {
  return (
    <section id="technology" className="bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="mb-20 flex flex-col items-center text-center">
          <div className="bg-accent text-primary mb-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
            <Server className="h-3 w-3" />
            {data.badge}
          </div>
          <h2 className="text-primary mb-4 text-4xl font-bold md:text-5xl">{data.title}</h2>
          <p className="text-muted-foreground max-w-2xl text-lg">{data.subtitle}</p>
        </div>

        <div className="mb-20 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {data.items?.map((item) => {
            return (
              <div
                key={item.id}
                className="group flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-xl text-3xl font-bold transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <span className="font-extrabold">{item.title[0]}</span>
                </div>
                <div>
                  <h3 className="text-primary mb-1 text-lg font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-12 border-t border-slate-100 pt-16">
          {data.bottomItems?.map((item) => {
            const Icon = iconMap[item.icon] || Smartphone;
            return (
              <div
                key={item.id}
                className="flex flex-col items-center gap-3 text-center md:flex-row md:text-left"
              >
                <div className="bg-primary/5 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-primary font-bold">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
