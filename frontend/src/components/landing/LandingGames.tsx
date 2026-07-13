import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { GAME_CATEGORIES } from "@/data/games";
import { useT } from "@/i18n/LanguageContext";

const accentClasses: Record<string, { bg: string; ring: string; text: string }> = {
  primary: {
    bg: "bg-gradient-spain",
    ring: "group-hover:border-primary/40",
    text: "text-primary",
  },
  secondary: {
    bg: "bg-secondary",
    ring: "group-hover:border-secondary/50",
    text: "text-secondary-foreground",
  },
  success: {
    bg: "bg-success",
    ring: "group-hover:border-success/40",
    text: "text-success",
  },
};

export const LandingGames = () => {
  const t = useT();
  const totalStages = GAME_CATEGORIES.reduce((acc, c) => acc + c.totalStages, 0);
  const availableCount = GAME_CATEGORIES.filter((c) => c.available).length;

  return (
    <section id="games" className="container pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14 md:mb-16">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/60 mb-4 sm:mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
              {t.landingGames.eyebrow}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4 sm:mb-5">
            {t.landingGames.titlePart1}{" "}
            <span className="text-gradient-spain">{t.landingGames.titleHighlight}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t.landingGames.subtitle(availableCount, totalStages)}
          </p>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {GAME_CATEGORIES.map((game, i) => {
          const accent = accentClasses[game.accent];
          const Icon = game.icon;
          const card = t.landingGames.cards[game.id as keyof typeof t.landingGames.cards];
          const title = card?.title ?? game.title;
          const tagline = card?.tagline ?? game.tagline;
          const description = card?.description ?? game.description;
          return (
            <Reveal key={game.id} delay={i * 0.06} y={28}>
              <div
                className={`group relative h-full rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated overflow-hidden ${accent.ring}`}
              >
                {!game.available && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider border border-border/60">
                    <Lock className="w-3 h-3" />
                    {t.landingGames.emBreve}
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-2xl ${accent.bg} flex items-center justify-center mb-5 shadow-card group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>

                <h3 className="font-display font-extrabold text-lg mb-1 tracking-tight">
                  {title}
                </h3>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${accent.text}`}>
                  {tagline}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="text-xs font-bold text-muted-foreground">
                    {game.totalStages} {t.landingGames.fases}
                  </span>
                  {game.available ? (
                    <Link
                      to={`/jogos/${game.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all"
                    >
                      {t.landingGames.jogar}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground/60">—</span>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Button asChild size="xl" variant="hero" className="group w-full sm:w-auto max-w-sm">
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
