'use client';

import type { LandingPage } from '@/payload-types';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Map,
  Search,
  ShieldAlert,
  Users,
  WifiOff,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLocale } from 'next-intl';

import { Card } from '@/components/ui/card';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Map: Map,
  Users: Users,
  Search: Search,
  ShieldAlert: ShieldAlert,
  Globe: Globe,
  WifiOff: WifiOff,
};

export function FeaturesGrid({ data }: { data: LandingPage['features'] }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="features" className="relative bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="bg-accent text-primary mb-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
            <Zap className="h-3 w-3" />
            {data.badge}
          </div>
          <h2 className="text-primary mb-4 text-4xl font-bold md:text-5xl">{data.title}</h2>
          <p className="text-muted-foreground max-w-2xl text-lg">{data.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.items?.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Map;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group bg-card h-full rounded-2xl border-none p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Icon className="text-primary h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-primary mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-primary mt-auto flex items-center text-sm font-bold">
                    {feature.linkText} <ArrowIcon className="ml-1 h-4 w-4" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
