import { FAQSection } from '@/components/landing/faq';
import { FeaturesGrid } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { LandingNavbar } from '@/components/landing/navbar';
import { TeamSection } from '@/components/landing/team';
import { TechStack } from '@/components/landing/tech-stack';

export default function RootPage() {
  return (
    <div className="bg-background selection:bg-secondary selection:text-secondary-foreground flex min-h-screen flex-col font-sans">
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <FeaturesGrid />
        <HowItWorks />
        <TeamSection />
        <FAQSection />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
}
