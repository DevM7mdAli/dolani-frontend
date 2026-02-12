'use client';

import { Map, Search, ShieldAlert, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';

const features = [
  { id: 'precision', icon: Map, color: 'text-blue-500' },
  { id: 'faculty', icon: UserCheck, color: 'text-green-500' },
  { id: 'search', icon: Search, color: 'text-purple-500' },
  { id: 'emergency', icon: ShieldAlert, color: 'text-red-500' },
];

export function FeaturesGrid() {
  const t = useTranslations('Landing.features');

  return (
    <section id="features" className="relative bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-primary mb-4 text-3xl font-bold">{t('title')}</h2>
          <div className="bg-secondary mx-auto h-1 w-16 rounded-full"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
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
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="group-hover:text-primary mb-3 text-xl font-bold text-slate-800 transition-colors">
                    {t(`${feature.id}Title`)}
                  </h3>
                  <p className="leading-relaxed text-slate-600">{t(`${feature.id}Desc`)}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
