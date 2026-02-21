'use client';

import { Link as I18nLink } from '@/i18n/routing';
import type { LandingPage } from '@/payload-types';
import { ArrowRight, Download } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';

export function CTASection({ data }: { data: LandingPage['cta'] }) {
  return (
    <section className="bg-primary relative overflow-hidden py-24 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">{data.title}</h2>
          <p className="mb-10 text-lg text-white/80 md:text-xl">{data.subtitle}</p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 w-full px-8 text-lg font-bold shadow-lg transition-transform duration-200 hover:scale-105 sm:w-auto"
            >
              {data.downloadIos} <Download className="ml-2 h-5 w-5" />
            </Button>
            <I18nLink href="/signin">
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-full border-white/20 bg-white/10 px-8 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
              >
                {data.downloadAndroid} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </I18nLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
