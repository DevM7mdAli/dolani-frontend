'use client';

import type { LandingPage } from '@/payload-types';
import { motion } from 'motion/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQSection({ data }: { data: LandingPage['faq'] }) {
  return (
    <section id="faq" className="bg-white py-24">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-primary mb-4 text-3xl font-bold">{data.title}</h2>
          <div className="bg-secondary mx-auto h-1 w-16 rounded-full"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {data.questions?.map((q) => (
              <AccordionItem key={q.id} value={q.id!} className="border-b border-slate-200">
                <AccordionTrigger className="hover:text-primary text-start text-lg font-semibold text-slate-800 transition-colors">
                  {q.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400">
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
