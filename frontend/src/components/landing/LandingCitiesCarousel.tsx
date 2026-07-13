import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Languages, Quote, ChevronLeft, ChevronRight } from "lucide-react";

import { Reveal } from "./Reveal";
import { cities, type City } from "@/data/cities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageContext";

// Duplicate the list so the marquee loops seamlessly
const loop = [...cities, ...cities];

// Approximate card width (incl. gap) used to step manually with arrows
const STEP_PX_MOBILE = 200; // 180px card + 20px gap
const STEP_PX_DESKTOP = 286; // 280px card + ~24px gap

export const LandingCitiesCarousel = () => {
  const { t, locale } = useLanguage();
  const pick = (pt: string, en: string) => locale === "en" ? en : pt;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<City | null>(null);
  const [manualOffset, setManualOffset] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const step = (direction: -1 | 1) => {
    const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
    const px = isDesktop ? STEP_PX_DESKTOP : STEP_PX_MOBILE;
    setManualOffset((prev) => prev + direction * px);
  };

  return (
    <section className="relative pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 lg:pb-32 bg-background overflow-hidden">
      <div className="container mb-8 sm:mb-10 md:mb-14 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider mb-4">
            {t.landingCities.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-3">
            {t.landingCities.titlePart1} <span className="text-gradient-spain">{t.landingCities.titleHighlight}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            {t.landingCities.subtitle}
          </p>
        </Reveal>
      </div>

      {/* Carrossel com mask gradient nas laterais */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        {/* Manual offset wrapper — driven by arrow buttons */}
        <div
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translate3d(${manualOffset}px, 0, 0)` }}
        >
          <div
            className={`flex gap-5 md:gap-6 w-max animate-cities-marquee ${
              hoveredIdx !== null ? "is-paused" : ""
            }`}
          >
          {loop.map((city, idx) => {
            const isHovered = hoveredIdx === idx;
            const isOtherHovered = hoveredIdx !== null && !isHovered;

            return (
              <motion.button
                key={`${city.name}-${idx}`}
                type="button"
                onClick={() => setSelected(city)}
                className="relative shrink-0 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[280px] h-[260px] sm:h-[300px] md:h-[340px] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-elevated focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  filter: isOtherHovered ? "blur(2px)" : "blur(0px)",
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                aria-label={t.landingCities.saibaMais(city.name)}
              >
                <img
                  src={city.img}
                  alt={`${city.name} — Espanha`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  draggable={false}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
                {/* Gradient overlay para legibilidade da legenda */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
                />
                {/* Legenda editorial */}
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <h3
                    className="text-white text-xl md:text-2xl tracking-[0.18em] font-light"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {city.name}
                  </h3>
                  <p className="text-white/70 text-[10px] md:text-xs uppercase tracking-wider mt-1">
                    {city.region}
                  </p>
                </div>
              </motion.button>
            );
          })}
          </div>
        </div>

        {/* Setas de navegação */}
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Cidade anterior"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur border border-border/60 shadow-elevated text-foreground hover:bg-background hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Próxima cidade"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur border border-border/60 shadow-elevated text-foreground hover:bg-background hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Modal com detalhes da cidade */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
          {selected && (
            <>
              <div className="relative h-56 md:h-72 w-full overflow-hidden">
                <img
                  src={selected.img}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <h3
                    className="text-white text-3xl md:text-4xl tracking-[0.18em] font-light drop-shadow-lg"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {selected.name}
                  </h3>
                  <p className="text-white/85 text-xs uppercase tracking-wider mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {selected.region}
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-5">
                <DialogHeader className="sr-only">
                  <DialogTitle>{selected.name}</DialogTitle>
                  <DialogDescription>{pick(selected.about, selected.aboutEn)}</DialogDescription>
                </DialogHeader>

                <div>
                  <h4 className="font-display font-bold text-base mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-spain rounded-full" />
                    {t.landingCities.sobreCidade}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {pick(selected.about, selected.aboutEn)}
                  </p>
                </div>

                <div>
                  <h4 className="font-display font-bold text-base mb-2 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-primary" />
                    {t.landingCities.comoSeFala}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {pick(selected.language, selected.languageEn)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-accent/40 p-4">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display font-bold text-lg md:text-xl text-foreground">
                        "{selected.expression.phrase}"
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        {pick(selected.expression.meaning, selected.expression.meaningEn)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
