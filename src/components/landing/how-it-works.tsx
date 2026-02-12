'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

export function HowItWorks() {
  const t = useTranslations('Landing.how');

  const steps = [1, 2, 3];

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-primary mb-4 text-3xl font-bold">{t('title')}</h2>
          <div className="bg-secondary mx-auto h-1 w-16 rounded-full"></div>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-8 right-[16%] left-[16%] z-0 hidden h-0.5 bg-slate-200 md:block"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="border-secondary text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white text-2xl font-bold shadow-lg">
                {step}
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{t(`step${step}Title`)}</h3>
              <p className="max-w-xs text-slate-600">{t(`step${step}Desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
