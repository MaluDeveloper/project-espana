import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { GAME_CATEGORIES, type GameCategory } from "@/data/games";
import { getCategoryStats } from "@/lib/progress";
import { Sparkles, Lock, Trophy } from "lucide-react";
import { Stars } from "@/components/Stars";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageContext";

const accentClasses: Record<GameCategory["accent"], string> = {
  primary: "from-primary/20 to-primary/5 border-primary/30 text-primary",
  secondary: "from-secondary/30 to-secondary/5 border-secondary/40 text-secondary-foreground",
  success: "from-success/20 to-success/5 border-success/30 text-success",
};

const Jogos = () => {
  const t = useT();
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 max-w-2xl"
      >
        <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">
          {t.jogos.listing.eyebrow}
        </div>
        <h1 className="font-display text-3xl md:text-5xl mb-3">
          {t.jogos.listing.titulo1}{" "}
          <span className="text-gradient-spain">{t.jogos.listing.tituloHighlight}</span>
        </h1>
        <p className="text-muted-foreground text-lg">{t.jogos.listing.subtitulo}</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {GAME_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          const stats = cat.available ? getCategoryStats(cat.id) : { completed: 0, stars: 0, xp: 0 };
          const tCat = t.jogos.categories[cat.id] ?? {
            title: cat.title,
            tagline: cat.tagline,
            description: cat.description,
          };
          const card = (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.35 }}
              className={cn(
                "group relative h-full rounded-3xl p-6 border bg-gradient-to-br shadow-card transition-all duration-300",
                accentClasses[cat.accent],
                cat.available
                  ? "hover:shadow-elevated hover:-translate-y-1 cursor-pointer"
                  : "opacity-70 grayscale-[20%]",
              )}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                  <Icon className="w-7 h-7" />
                </div>
                {!cat.available && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-card/80 border border-border text-muted-foreground">
                    <Lock className="w-3 h-3" /> {t.jogos.listing.proximamente}
                  </span>
                )}
                {cat.available && stats.completed > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-card border border-border">
                    <Trophy className="w-3 h-3 text-secondary-foreground" /> {stats.completed}
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl text-foreground mb-1">{tCat.title}</h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tCat.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {cat.totalStages} {t.jogos.listing.fases} · {t.jogos.listing.niveis}
                </span>
                {cat.available && stats.xp > 0 && (
                  <span className="inline-flex items-center gap-1 font-bold text-foreground">
                    <Sparkles className="w-3 h-3 text-primary" /> {stats.xp} XP
                  </span>
                )}
              </div>
              {cat.available && stats.completed > 0 && (
                <div className="mt-3 pt-3 border-t border-border/60">
                  <Stars
                    value={
                      stats.completed >= cat.totalStages * 5
                        ? 3
                        : stats.completed >= Math.ceil((cat.totalStages * 5 * 2) / 3)
                          ? 2
                          : stats.completed >= Math.ceil((cat.totalStages * 5) / 3)
                            ? 1
                            : 0
                    }
                    size="sm"
                  />
                </div>
              )}
            </motion.div>
          );
          return cat.available ? (
            <Link key={cat.id} to={`/jogos/${cat.id}`} aria-label={tCat.title} className="block h-full">
              {card}
            </Link>
          ) : (
            <div key={cat.id} aria-disabled className="h-full">
              {card}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Jogos;
