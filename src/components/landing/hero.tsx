'use client';

import { Link as I18nLink } from '@/i18n/routing';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';

export function Hero() {
  const t = useTranslations('Landing.hero');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="container mx-auto grid items-center gap-12 px-6 md:grid-cols-2">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center md:text-start"
        >
          <h1 className="mb-6 text-4xl leading-tight font-extrabold text-[#003B46] md:text-6xl">
            {t('headline')}
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-lg text-lg leading-relaxed md:mx-0 md:text-xl">
            {t('subheadline')}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/20 h-12 w-full px-8 text-lg font-bold shadow-lg transition-transform duration-200 hover:scale-105 sm:w-auto"
            >
              {tCommon('downloadApp')} <Download className="ml-2 h-5 w-5" />
            </Button>
            <I18nLink href="/dashboard/doctors">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/5 h-12 w-full px-8 text-lg font-semibold sm:w-auto"
              >
                {tCommon('facultyPortal')} <ArrowIcon className="ml-2 h-5 w-5" />
              </Button>
            </I18nLink>
          </div>
        </motion.div>

        {/* Visual / Animation Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="group relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-8 shadow-2xl"
        >
          {/* Isometric Floor Plan Mockup */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(226,232,240,0.4)_1px,transparent_1px),linear-gradient(to_right,rgba(226,232,240,0.4)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:40px_40px]"></div>

          {/* Pulsing Blue Dot Animation */}
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-60"
          >
            <motion.path
              d="M 20 80 Q 50 20 80 80"
              fill="transparent"
              stroke="#FFD700"
              strokeWidth="4"
              strokeDasharray="0 1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          </svg>
          <div className="bg-primary/10 absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-3xl"></div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="border-secondary relative z-20 max-w-xs rounded-2xl border-l-4 bg-white p-6 shadow-xl"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                A1
              </div>
              <div>
                <div className="font-bold text-slate-800">Lab 201</div>
                <div className="text-xs text-slate-500">24m away • ETA 1 min</div>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="bg-primary h-full w-2/3"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
