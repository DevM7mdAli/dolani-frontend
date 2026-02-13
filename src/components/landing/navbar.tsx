'use client';

import { useState } from 'react';

import { Link as I18nLink, usePathname, useRouter } from '@/i18n/routing';
import { Globe, MapPin, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export function LandingNavbar() {
  const t = useTranslations('Landing.nav');
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: '#features', label: t('features') },
    { href: '#technology', label: t('technology') },
    { href: '#team', label: t('team') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <nav className="bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full">
            <MapPin className="text-secondary-foreground h-5 w-5" />
          </div>
          <span className="text-primary text-xl font-bold tracking-tight">Dolani</span>
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
          <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle Language">
            <Globe className="text-primary h-5 w-5" />
          </Button>
          <I18nLink href="/signin">
            <Button variant="secondary" className="text-secondary-foreground font-semibold">
              {t('login')}
            </Button>
          </I18nLink>
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
              <div className="mt-2 flex items-center justify-between gap-4">
                <Button variant="outline" size="sm" onClick={toggleLanguage} className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  Language
                </Button>
                <I18nLink href="/signin" className="w-full">
                  <Button variant="secondary" size="sm" className="w-full">
                    {t('login')}
                  </Button>
                </I18nLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
