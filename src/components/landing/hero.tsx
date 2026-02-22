/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';

import { Link as I18nLink } from '@/i18n/routing';
import type { LandingPage } from '@/payload-types';
import { ArrowLeft, ArrowRight, ArrowRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';

export function Hero({ data }: { data: LandingPage['hero'] }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
      {/* Background Gradient */}
      <div className="from-accent/50 absolute top-0 right-0 left-0 -z-10 h-150 bg-linear-to-b to-transparent"></div>

      <div className="container mx-auto grid items-center gap-12 px-6 md:grid-cols-2">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center md:text-start"
        >
          <h1 className="text-primary mb-6 text-5xl leading-tight font-extrabold md:text-6xl lg:text-7xl">
            {data.headline} <br />
            <span className="text-secondary">{data.headlineHighlight}</span>
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-lg text-lg leading-relaxed md:mx-0 md:text-xl">
            {data.subheadline}
          </p>

          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full rounded-full px-8 text-base font-semibold sm:w-auto"
            >
              {data.downloadApp} <ArrowIcon className="ml-2 h-4 w-4" />
            </Button>
            <I18nLink href="/signin">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/5 h-12 w-full rounded-full px-8 text-base font-semibold sm:w-auto"
              >
                <div className="border-primary mr-2 flex h-6 w-6 items-center justify-center rounded-full border">
                  <ArrowRightIcon className="h-3 w-3" />
                </div>
                {data.watchDemo}
              </Button>
            </I18nLink>
          </div>

          {/* Active Users Badge */}
          <div className="flex items-center justify-center gap-4 md:justify-start">
            <div className="flex -space-x-3">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white">
                MA
              </div>
              <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold">
                SA
              </div>
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white">
                KA
              </div>
              <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold">
                +12
              </div>
            </div>
            <div className="text-left">
              <div className="text-primary text-sm font-bold">{data.activeUsers}</div>
              <div className="text-muted-foreground text-xs">{data.activeUsersText}</div>
            </div>
          </div>
        </motion.div>

        {/* Visual / Animation Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex h-[500px] w-full items-center justify-center"
        >
          {/* Main Card */}
          <div className="relative h-[400px] w-[500px] rounded-[2rem] bg-white p-4 shadow-2xl">
            {/* Inner Map Area */}
            {data.heroImage ? (
              <Image
                src={
                  typeof data.heroImage === 'string'
                    ? data.heroImage
                    : (data.heroImage as any).url || ''
                }
                className="h-full w-full rounded-[1.5rem] object-cover"
                width={500}
                height={400}
                alt="Hero navigation mockup"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-slate-200">
                <span className="text-muted-foreground text-center text-sm font-medium">
                  Hero image will appear here
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
