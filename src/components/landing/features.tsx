'use client';

import type { LandingPage } from '@/payload-types';
import { Map, Search, ShieldAlert, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

import { Card } from '@/components/ui/card';

const iconMap = {
  precision: Map,
  faculty: UserCheck,
  search: Search,
  emergency: ShieldAlert,
};

const colorMap = {
  precision: 'text-blue-500',
  faculty: 'text-green-500',
  search: 'text-purple-500',
  emergency: 'text-red-500',
};

export function FeaturesGrid({ data }: { data: LandingPage['features'] }) {
  return (
    <section id="features" className="relative bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-primary mb-4 text-3xl font-bold">{data.title}</h2>
          <div className="bg-secondary mx-auto h-1 w-16 rounded-full"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.items?.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Map;
            const color = colorMap[feature.icon as keyof typeof colorMap] || 'text-primary';
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full border-none bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div
                    className={`group-hover:bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 transition-colors`}
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="group-hover:text-primary mb-3 text-xl font-bold text-slate-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-slate-600">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
