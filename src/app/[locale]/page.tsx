import { CTASection } from '@/components/landing/cta';
import { FAQSection } from '@/components/landing/faq';
import { FeaturesGrid } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { LandingNavbar } from '@/components/landing/navbar';
import { TeamSection } from '@/components/landing/team';
import { TechStack } from '@/components/landing/tech-stack';
import configPromise from '@/payload.config';
import { getPayload } from 'payload';

export default async function RootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const payload = await getPayload({ config: configPromise });
  const landingPage = await payload.findGlobal({
    slug: 'landing-page',
    locale: locale as 'en' | 'ar',
  });

  return (
    <div className="bg-background selection:bg-secondary selection:text-secondary-foreground flex min-h-screen flex-col font-sans">
      <LandingNavbar data={landingPage.nav} />
      <main className="flex-1">
        <Hero data={landingPage.hero} />
        <FeaturesGrid data={landingPage.features} />
        <HowItWorks data={landingPage.howItWorks} />
        <TechStack data={landingPage.techStack} />
        <TeamSection data={landingPage.team} />
        <FAQSection data={landingPage.faq} />
        <CTASection data={landingPage.cta} />
      </main>
      <Footer data={landingPage.footer} />
    </div>
  );
}
