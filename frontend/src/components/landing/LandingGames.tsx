import {
  heroEyebrowClass,
  heroFontStyle,
  heroHighlightClass,
  heroHighlightStyle,
  heroTitleClass,
} from "./heroTypography";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import CarouselStacked from "@/components/ui/carousel-07";
import { GAME_CATEGORIES } from "@/data/games";
import { useT } from "@/i18n/LanguageContext";
import barcelona from "@/assets/cities/barcelona.jpg";
import granada from "@/assets/cities/granada.jpg";
import toledo from "@/assets/cities/toledo.jpg";
import sevilla from "@/assets/cities/sevilla.jpg";
import valencia from "@/assets/cities/valencia.jpg";

// One photo per slide, in the same order as t.landingGames.slides.
const SLIDE_IMAGES = [barcelona, granada, toledo, sevilla, valencia];

export const LandingGames = () => {
  const t = useT();
  const totalStages = GAME_CATEGORIES.reduce((acc, c) => acc + c.totalStages, 0);
  const availableCount = GAME_CATEGORIES.filter((c) => c.available).length;
  const slides = t.landingGames.slides.map((slide, i) => ({ ...slide, image: SLIDE_IMAGES[i] }));

  return (
    <section id="games" className="container pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 lg:pb-32" style={heroFontStyle}>
      <div className="max-w-3xl mx-auto text-center mb-2 sm:mb-4">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/60 mb-4 sm:mb-5">
            <span className={heroEyebrowClass}>
              {t.landingGames.eyebrow}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className={`${heroTitleClass} text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-5`}>
            {t.landingGames.titlePart1}{" "}
            <span className={heroHighlightClass} style={heroHighlightStyle}>
              {t.landingGames.titleHighlight}
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t.landingGames.subtitle(availableCount, totalStages)}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.25} y={32}>
        <CarouselStacked
          slides={slides}
          className="py-0 sm:-mt-6"
          prevLabel={t.landingGames.prev}
          nextLabel={t.landingGames.next}
          badgeClassName="font-medium tracking-[0.25em] text-[10px] sm:text-[11px]"
          titleClassName="font-[550] tracking-[-0.03em]"
        />
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-4 sm:mt-6 flex justify-center">
          <Button asChild size="xl" variant="hero" className="group w-full sm:w-auto max-w-sm rounded-full font-normal">
            <Link to="/jogos">
              {t.landingGames.verTodos}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
};
