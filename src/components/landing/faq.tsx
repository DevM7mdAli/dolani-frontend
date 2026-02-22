'use client';

import type { LandingPage } from '@/payload-types';
import { HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQSection({ data }: { data: LandingPage['faq'] }) {
  return (
    <section id="faq" className="bg-background relative overflow-hidden py-24">
      {/* Background decoration */}
      <div className="bg-accent/30 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"></div>
      <div className="bg-secondary/10 absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto max-w-3xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="bg-accent text-primary mb-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
            <HelpCircle className="h-3 w-3" />
            {data.badge}
          </div>
          <h2 className="text-primary mb-4 text-4xl font-bold md:text-5xl">{data.title}</h2>
          <p className="text-muted-foreground text-lg">{data.subtitle}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {data.questions?.map((q) => (
              <AccordionItem
                key={q.id}
                value={q.id!}
                className="rounded-2xl border border-slate-100 bg-white px-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <AccordionTrigger className="py-6 hover:no-underline">
                  <span className="text-primary hover:text-secondary-foreground text-start text-lg font-bold transition-colors">
                    {q.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {q.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
