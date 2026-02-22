'use client';

import { Link as I18nLink } from '@/i18n/routing';
import type { LandingPage } from '@/payload-types';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';

export function CTASection({ data }: { data: LandingPage['cta'] }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="bg-secondary/20 absolute top-0 right-0 h-150 w-150 translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"></div>
        <div className="bg-accent/20 absolute bottom-0 left-0 h-100 w-100 -translate-x-1/2 translate-y-1/2 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <h2 className="mb-8 text-5xl leading-tight font-extrabold tracking-tight md:text-6xl">
            {data.title}
          </h2>
          <p className="text-primary-foreground/80 mx-auto mb-12 max-w-2xl text-xl font-light md:text-2xl">
            {data.subtitle}
          </p>

          <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/20 h-16 w-full rounded-full px-10 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 sm:w-auto"
            >
              {data.downloadIos} <ArrowIcon className="ml-2 h-5 w-5" />
            </Button>
            <I18nLink href="/signin">
              <Button
                size="lg"
                className="text-primary h-16 w-full rounded-full bg-white px-10 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/90 sm:w-auto"
              >
                {data.downloadAndroid} <ArrowIcon className="ml-2 h-5 w-5" />
              </Button>
            </I18nLink>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 text-sm font-medium text-white/90 md:flex-row md:gap-12">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-secondary h-5 w-5" />
              <span>{data.feature1}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-secondary h-5 w-5" />
              <span>{data.feature2}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-secondary h-5 w-5" />
              <span>{data.feature3}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
