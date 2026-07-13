import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/LanguageContext";

export const LandingHero = () => {
  const t = useT();

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 md:pt-40 md:pb-32 bg-gradient-hero-deep text-navy-foreground">
      {/* Soft radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.3),transparent_55%),radial-gradient(ellipse_at_bottom_right,hsl(var(--secondary)/0.2),transparent_50%)]"
      />

      {/* Cloud-like glow puffs, drifting near the bottom edge */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-64 sm:h-72 md:h-80 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-16 left-[8%] w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-secondary/25 blur-3xl" />
        <div className="absolute -bottom-24 left-[38%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-navy-foreground/15 blur-3xl" />
        <div className="absolute -bottom-16 right-[10%] w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-primary-glow/20 blur-3xl" />
      </div>

      {/* Cloud silhouette — soft gradient horizon blending into the next section */}
      <svg
        aria-hidden
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-20 sm:h-28 md:h-36 text-background"
      >
        <defs>
          <linearGradient id="heroCloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          fill="url(#heroCloudGrad)"
          d="M0,100 Q60,40 120,90 Q180,140 240,80 Q300,20 360,90 Q420,150 480,90 Q540,30 600,90 Q660,150 720,90 Q780,30 840,90 Q900,150 960,90 Q1020,30 1080,90 Q1140,150 1200,90 Q1260,30 1320,90 Q1380,140 1440,90 L1440,180 L0,180 Z"
        />
      </svg>

      <div className="container relative">
        <div className="max-w-3xl text-center mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display font-extrabold text-[2.1rem] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.05] tracking-tight mb-5 text-navy-foreground"
          >
            {t.hero.titlePart1}{" "}
            <span className="text-gradient-spain">{t.hero.titleHighlight}</span>
            <br className="hidden md:block" /> {t.hero.titlePart2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg md:text-xl text-navy-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mb-7"
          >
            <Button asChild size="xl" variant="hero" className="group w-full sm:w-auto shadow-elevated">
              <Link to="/cadastro">
                {t.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="group w-full sm:w-auto border-navy-foreground/30 bg-navy-foreground/10 text-navy-foreground hover:bg-navy-foreground/20 hover:text-navy-foreground"
            >
              <a href="#como-funciona">
                <Play className="w-4 h-4 fill-current" />
                {t.hero.ctaSecondary}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-navy-foreground/70"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" /> {t.hero.badgeNoCard}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" /> {t.hero.badgeMinutes}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" /> {t.hero.badgeStudents}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
