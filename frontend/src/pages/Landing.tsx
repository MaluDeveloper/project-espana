import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingCitiesCarousel } from "@/components/landing/LandingCitiesCarousel";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingGames } from "@/components/landing/LandingGames";
import { LandingCourses } from "@/components/landing/LandingCourses";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingPricing } from "@/components/landing/LandingPricing";

import { InlineCta } from "@/components/landing/InlineCta";
import { ScrollMaskHero } from "@/components/landing/ScrollMaskHero";

import { LandingFooter } from "@/components/landing/LandingFooter";
import { Preloader } from "@/components/Preloader";
import { useT } from "@/i18n/LanguageContext";

const Landing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const t = useT();

  // Trigger exit after the brand is "absorbed"
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll while preloader is visible
  useEffect(() => {
    if (isLoading) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" onComplete={() => { }} />}
      </AnimatePresence>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={isLoading ? { y: 80, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: isLoading ? 0 : 0.1 }}
        className="min-h-screen bg-background"
      >
        <LandingNav />
        <main>
          <LandingHero />

          <section id="como-funciona" className="scroll-mt-24">
            <LandingFeatures />
          </section>

          {/* CTA after "How it works" — tight spacing to stay close to the section */}
          <InlineCta
            label={t.inlineCtas.afterFeatures.label}
            variant="hero"
            className="!pt-0 !pb-16 md:!pb-20 -mt-12 md:-mt-20"
          />

          <section id="destinos" className="scroll-mt-24 -mt-2 sm:-mt-4 md:-mt-6">
            <LandingCitiesCarousel />
          </section>

          <section id="jogos" className="scroll-mt-24 -mt-2 sm:-mt-4 md:-mt-6">
            <LandingGames />
          </section>

          <section id="cursos" className="scroll-mt-24 -mt-2 sm:-mt-4 md:-mt-6">
            <LandingCourses />
          </section>

          {/* Immersive scroll-mask reveal before the pricing table */}
          <ScrollMaskHero />

          <section id="precos" className="scroll-mt-24">
            <LandingPricing />
          </section>

          <LandingTestimonials />
        </main>
        <LandingFooter />
      </motion.div>
    </>
  );
};

export default Landing;
