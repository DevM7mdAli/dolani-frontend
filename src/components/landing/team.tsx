'use client';

import type { LandingPage } from '@/payload-types';
import { Code, Cpu, Database, Palette, Users } from 'lucide-react';
import { motion } from 'motion/react';

import { Card, CardContent } from '@/components/ui/card';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Code: Code,
  Database: Database,
  Cpu: Cpu,
  Palette: Palette,
};

export function TeamSection({ data }: { data: LandingPage['team'] }) {
  return (
    <section id="team" className="relative overflow-hidden bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-accent text-primary mx-auto mb-4 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
              <Users className="h-3 w-3" />
              {data.badge}
            </div>
            <h2 className="text-primary mb-4 text-4xl font-bold md:text-5xl">{data.title}</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">{data.subtitle}</p>
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
                whileHover={{ y: -5 }}
              >
                <Card className="bg-card h-full overflow-hidden border-none text-center shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex h-32 items-center justify-center pt-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-100 bg-white p-2 shadow-sm">
                      <Icon className="text-primary h-12 w-12" strokeWidth={1.5} />
                    </div>
                  </div>
                  <CardContent className="pb-8">
                    <h3 className="text-primary text-xl font-bold">{member.name}</h3>
                    <p className="text-secondary mt-1 text-sm font-bold tracking-wide uppercase">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground mt-4 text-sm">{member.description}</p>
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
