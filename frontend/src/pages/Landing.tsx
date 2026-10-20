import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingDestinations } from "@/components/landing/LandingDestinations";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingGames } from "@/components/landing/LandingGames";
import { LandingCourses } from "@/components/landing/LandingCourses";
import { LandingPricing } from "@/components/landing/LandingPricing";

import { LandingFooter } from "@/components/landing/LandingFooter";
import { Preloader } from "@/components/Preloader";

const Landing = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Every load of the landing starts from the top so the preloader and all scroll animations
  // replay: stop the browser from restoring the old scroll position and drop any "#section"
  // left in the URL by the menu links (the browser would jump to it on reload).
  useLayoutEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    // GSAP keeps its own scroll memory and re-applies it on refresh; the browser can also
    // still jump to the old anchor at the "load" event, so reset again once loading settles.
    ScrollTrigger.clearScrollMemory("manual");
    // "instant": the site sets scroll-behavior: smooth on <html>, which would animate this jump.
    const toTop = () => window.scrollTo({ top: 0, behavior: "instant" });
    toTop();
    // Only while the preloader still locks scrolling: on a slow load the event can fire after the
    // visitor has started scrolling, and yanking them back up would be worse than the bug.
    const onLoad = () => {
      if (document.body.style.overflow === "hidden") toTop();
    };
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      history.scrollRestoration = previous;
    };
  }, []);

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
        // ScrollTrigger measured the sections while the page was still offset by the slide-in,
        // so re-measure once it lands or the pinned "how it works" timeline starts 80px late.
        onAnimationComplete={() => ScrollTrigger.refresh()}
        className="min-h-screen bg-background"
      >
        <LandingNav />
        <main>
          <LandingHero />

          <section id="como-funciona" className="scroll-mt-24">
            <LandingFeatures />
          </section>

          <section id="cursos" className="scroll-mt-24 -mt-2 sm:-mt-4 md:-mt-6">
            <LandingCourses />
          </section>

          <section id="jogos" className="scroll-mt-24 -mt-2 sm:-mt-4 md:-mt-6">
            <LandingGames />
          </section>

          <section id="precos" className="scroll-mt-24">
            <LandingPricing />
          </section>

          <section id="destinos">
            <LandingDestinations />
          </section>
        </main>
        <LandingFooter />
      </motion.div>
    </>
  );
};

export default Landing;
