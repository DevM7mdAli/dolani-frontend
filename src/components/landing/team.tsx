'use client';

import { Code, Cpu, Palette, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';

export function TeamSection() {
  const t = useTranslations('Landing.team');

  const members = [
    { id: 'member1', name: t('member1'), role: t('role1'), icon: Code },
    { id: 'member2', name: t('member2'), role: t('role2'), icon: Server },
    { id: 'member3', name: t('member3'), role: t('role3'), icon: Cpu },
    { id: 'member4', name: t('member4'), role: t('role4'), icon: Palette },
  ];

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
            <h2 className="text-primary mb-4 text-3xl font-bold">{t('title')}</h2>
            <div className="bg-secondary mx-auto mb-6 h-1 w-16 rounded-full"></div>
            <p className="mx-auto max-w-2xl text-slate-600">{t('subtitle')}</p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => {
            const Icon = member.icon;
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
