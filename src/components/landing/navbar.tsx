'use client';

import { useState } from 'react';

import { Link as I18nLink, usePathname, useRouter } from '@/i18n/routing';
import type { LandingPage } from '@/payload-types';
import { Globe, MapPin, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';

export function LandingNavbar({ data }: { data: LandingPage['nav'] }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: '#features', label: data.features },
    { href: '#how-it-works', label: data.howItWorks },
    { href: '#technology', label: data.technology },
    { href: '#team', label: data.team },
    { href: '#faq', label: data.faq },
  ];

  return (
    <nav className="bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full">
            <MapPin className="text-secondary-foreground h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-primary text-lg leading-none font-bold tracking-tight">
              {data.logoText}
            </span>
            <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              {data.logoSubtext}
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Button variant="outline" className="rounded-full px-6 font-medium" onClick={() => {}}>
            {data.viewDemo}
          </Button>
          <I18nLink href="/signin">
            <Button
              variant="secondary"
              className="text-secondary-foreground rounded-full px-6 font-semibold"
            >
              {data.login}
            </Button>
          </I18nLink>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label="Toggle Language"
            className="rounded-full"
          >
            <Globe className="text-primary h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-primary p-2 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-background border-border overflow-hidden border-b md:hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:bg-muted rounded-md p-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-center rounded-full">
                  {data.viewDemo}
                </Button>
                <I18nLink href="/signin" className="w-full">
                  <Button variant="secondary" className="w-full justify-center rounded-full">
                    {data.login}
                  </Button>
                </I18nLink>
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="w-full justify-center rounded-full"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Language
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
