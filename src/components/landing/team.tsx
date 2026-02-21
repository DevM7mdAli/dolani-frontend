'use client';

import type { LandingPage } from '@/payload-types';
import { Code, Cpu, Palette, Server } from 'lucide-react';
import { motion } from 'motion/react';

import { Card, CardContent } from '@/components/ui/card';

const iconMap = {
  Code,
  Server,
  Cpu,
  Palette,
};

export function TeamSection({ data }: { data: LandingPage['team'] }) {
  return (
    <section id="team" className="relative overflow-hidden bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary mb-4 text-3xl font-bold">{data.title}</h2>
            <div className="bg-secondary mx-auto mb-6 h-1 w-16 rounded-full"></div>
            <p className="mx-auto max-w-2xl text-slate-600">{data.subtitle}</p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.members?.map((member, index) => {
            const Icon = iconMap[member.icon as keyof typeof iconMap] || Code;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full overflow-hidden border-none text-center shadow-sm transition-all duration-300 hover:shadow-xl">
                  <div className="from-primary/10 flex h-32 items-center justify-center bg-linear-to-b to-transparent">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 shadow-md">
                      <Icon className="text-primary h-10 w-10" />
                    </div>
                  </div>
                  <CardContent className="pt-4 pb-8">
                    <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                    <p className="text-secondary-foreground/80 mt-1 text-sm font-medium">
                      {member.role}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
