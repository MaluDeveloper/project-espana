import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import valenciaImg from "@/assets/cities/valencia.jpg";
import madridImg from "@/assets/cities/madrid.jpg";
import sevillaImg from "@/assets/cities/sevilla.jpg";
import { useT } from "@/i18n/LanguageContext";
import { isLevelUnlocked } from "@/lib/course-progress";
import type { LevelId } from "@/data/games";

const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("spanish-ai-user"));
};

interface CourseLevel {
  module: string;
  level: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  to: string;
  bg: string;
  levelId: LevelId;
  isFirst: boolean;
}

const Z_LAYERS = ["z-10", "z-20", "z-30", "z-40", "z-50"];

interface CourseStackItemProps {
  level: CourseLevel;
  index: number;
  ctaStartFree: string;
  ctaStartNow: string;
  ctaLocked: string;
}

const CourseStackItem = ({ level, index, ctaStartFree, ctaStartNow, ctaLocked }: CourseStackItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reversed = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div
      ref={ref}
      className={`h-screen sticky top-0 ${Z_LAYERS[index] ?? "z-10"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full flex items-center justify-center px-3 sm:px-4 md:px-8 lg:px-12 py-6 sm:py-8"
      >
        <article
          className={`group relative w-full max-w-7xl h-full max-h-[92vh] lg:max-h-[88vh] ${level.bg} border border-border/60 rounded-[28px] sm:rounded-[40px] md:rounded-[60px] shadow-elevated overflow-hidden`}
        >
          <div className="h-full w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-14 items-center p-5 sm:p-8 md:p-10 lg:p-14 overflow-y-auto">
            {/* Image column */}
            <div
              className={`relative w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-full lg:min-h-[260px] rounded-[22px] sm:rounded-[28px] md:rounded-[48px] overflow-hidden bg-muted shadow-2xl shrink-0 ${reversed ? "lg:order-2" : "lg:order-1"
                }`}
            >
              <motion.img
                src={level.image}
                alt={level.imageAlt}
                loading="lazy"
                decoding="async"
                style={{ y: imgY }}
                className="absolute inset-0 w-full h-[115%] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-5 left-5 lg:hidden">
                <span className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-[10px] font-bold tracking-[0.2em] text-foreground border border-border/60">
                  {level.module}
                </span>
              </div>
            </div>

            {/* Text column */}
            <div
              className={`transition-transform duration-500 ease-out ${reversed
                  ? "lg:order-1 lg:group-hover:-translate-x-2.5"
                  : "lg:order-2 lg:group-hover:translate-x-2.5"
                }`}
            >
              <div className="hidden lg:inline-flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-primary" />
                <span className="text-xs font-bold tracking-[0.3em] text-primary">
                  {level.module}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3 sm:mb-4">
                {level.level}
              </p>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-4 sm:mb-6">
                {level.title}
              </h3>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-xl">
                {level.description}
              </p>

              {(() => {
                // A1 (first): always accessible — sends to login if not logged in, else to course.
                // Higher levels: locked unless previous level passed.
                if (level.isFirst) {
                  const loggedIn = isLoggedIn();
                  const target = loggedIn ? level.to : "/login";
                  return (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="group/btn relative overflow-hidden border-2 border-foreground text-foreground hover:text-primary-foreground hover:border-primary px-8 h-14 rounded-full font-bold tracking-wide"
                    >
                      <Link to={target}>
                        <span className="absolute inset-0 bg-primary translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        <span className="relative z-10 inline-flex items-center gap-2">
                          {ctaStartFree}
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </span>
                      </Link>
                    </Button>
                  );
                }

                const unlocked = isLevelUnlocked(level.levelId);
                if (!unlocked) {
                  return (
                    <Button
                      size="lg"
                      variant="outline"
                      disabled
                      aria-disabled="true"
                      className="border-2 border-foreground/30 text-foreground/60 px-8 h-14 rounded-full font-bold tracking-wide opacity-60 cursor-not-allowed"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {ctaLocked}
                      </span>
                    </Button>
                  );
                }

                return (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="group/btn relative overflow-hidden border-2 border-foreground text-foreground hover:text-primary-foreground hover:border-primary px-8 h-14 rounded-full font-bold tracking-wide"
                  >
                    <Link to={level.to}>
                      <span className="absolute inset-0 bg-primary translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                      <span className="relative z-10 inline-flex items-center gap-2">
                        {ctaStartNow}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                );
              })()}
            </div>
          </div>

          {/* Ghost number */}
          <span
            aria-hidden
            className={`pointer-events-none select-none absolute bottom-2 sm:bottom-4 text-[80px] sm:text-[120px] md:text-[160px] lg:text-[220px] font-display font-extrabold leading-none text-foreground/[0.05] ${reversed
                ? "left-5 sm:left-8 lg:left-14"
                : "right-5 sm:right-8 lg:right-14"
              }`}
          >
            0{index + 1}
          </span>
        </article>
      </motion.div>
    </div>
  );
};

export const LandingCourses = () => {
  const t = useT();

  const levels: CourseLevel[] = [
    {
      ...t.landingCourses.levels.a1,
      image: valenciaImg,
      to: "/cursos/A1",
      bg: "bg-gradient-warm",
      levelId: "A1",
      isFirst: true,
    },
    {
      ...t.landingCourses.levels.b1,
      image: madridImg,
      to: "/cursos/B1",
      bg: "bg-background",
      levelId: "B1",
      isFirst: false,
    },
    {
      ...t.landingCourses.levels.c1,
      image: sevillaImg,
      to: "/cursos/C1",
      bg: "bg-gradient-warm",
      levelId: "C1",
      isFirst: false,
    },
  ];

  return (
    <section id="cursos" className="relative bg-background scroll-mt-24">
      {/* Header */}
      <div className="container pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/60 mb-4 sm:mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
              {t.landingCourses.eyebrow}
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-4 sm:mb-6">
            {t.landingCourses.titlePart1}{" "}
            <span className="text-gradient-spain">{t.landingCourses.titleHighlight}</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t.landingCourses.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Stacking container — sticky on all breakpoints */}
      <div className="block">
        {levels.map((lvl, i) => (
          <CourseStackItem
            key={lvl.module}
            level={lvl}
            index={i}
            ctaStartFree={t.landingCourses.ctaStartFree}
            ctaStartNow={t.landingCourses.ctaStartNow}
            ctaLocked={t.landingCourses.ctaLocked}
          />
        ))}
      </div>

      {/* Spacer */}
      <div aria-hidden className="h-16 sm:h-20 md:h-24 lg:h-32" />
    </section>
  );
};
