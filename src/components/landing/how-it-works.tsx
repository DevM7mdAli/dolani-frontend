/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';

import type { LandingPage } from '@/payload-types';
import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { motion } from 'motion/react';

const iconMap: Record<string, any> = {
  ShieldCheck: ShieldCheck,
  BatteryCharging: BatteryCharging,
  AlertTriangle: AlertTriangle,
};

export function HowItWorks({ data }: { data: LandingPage['howItWorks'] }) {
  return (
    <>
      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-primary text-primary-foreground relative overflow-hidden py-24"
      >
        <div className="container mx-auto px-6">
          <div className="mb-20 flex flex-col items-center text-center">
            <div className="text-secondary mb-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
              <Smartphone className="h-3 w-3" />
              {data.badge}
            </div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">{data.title}</h2>
            <p className="text-primary-foreground/70 max-w-2xl text-lg">{data.subtitle}</p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting Line (Desktop) */}
            <div className="absolute top-8 right-[16%] left-[16%] z-0 hidden h-px bg-white/20 md:block"></div>

            {data.steps?.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="bg-secondary text-secondary-foreground mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-[0_0_30px_rgba(253,185,19,0.3)]">
                  {step.number}
                </div>
                <div className="h-full w-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                  <h3 className="mb-4 text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-background relative overflow-hidden py-24">
        <div className="container mx-auto grid items-center gap-16 px-6 lg:grid-cols-2">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-accent text-primary mb-4 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
              <CheckCircle2 className="h-3 w-3" />
              {data.whyChooseBadge}
            </div>
            <h2 className="text-primary mb-6 text-4xl font-bold md:text-5xl">
              {data.whyChooseTitle}
            </h2>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              {data.whyChooseSubtitle}
            </p>

            <div className="flex flex-col gap-8">
              {data.whyChooseItems?.map((item) => {
                const Icon = iconMap[item.icon] || CheckCircle2;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="bg-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <Icon className="text-primary h-5 w-5" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-primary mb-1 text-lg font-bold">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Visual Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex h-[500px] w-full items-center justify-center"
          >
            {/* Background Decoration */}
            <div className="bg-accent/50 absolute inset-0 scale-95 -rotate-6 rounded-[3rem]"></div>

            {/* Main Card */}
            <div className="relative h-[450px] w-[400px] rounded-[2rem] border border-slate-100 bg-white p-4 shadow-2xl">
              {/* Inner Screen Area */}
              {data.whyChooseImage ? (
                <Image
                  src={
                    typeof data.whyChooseImage === 'string'
                      ? data.whyChooseImage
                      : (data.whyChooseImage as any).url || ''
                  }
                  className="h-full w-full rounded-2xl object-cover"
                  width={400}
                  height={450}
                  alt="Phone mockup"
                />
              ) : (
                <div className="bg-primary flex flex-col items-center justify-center rounded-2xl p-8">
                  <div className="border-secondary relative mb-8 h-24 w-16 rounded-xl border-4">
                    <div className="bg-secondary absolute bottom-2 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full"></div>
                  </div>
                  <div className="mt-auto w-full space-y-3">
                    <div className="h-2 w-full rounded-full bg-white/20"></div>
                    <div className="h-2 w-3/4 rounded-full bg-white/20"></div>
                    <div className="bg-secondary mt-4 h-8 w-full rounded-lg"></div>
                  </div>
                </div>
              )}

              {/* Floating Badges */}
              <div className="absolute -top-6 -right-6 rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
                <div className="text-primary text-2xl font-bold">{data.statBadge1Value}</div>
                <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  {data.statBadge1Label}
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
                <div className="text-primary text-2xl font-bold">{data.statBadge2Value}</div>
                <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  {data.statBadge2Label}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
