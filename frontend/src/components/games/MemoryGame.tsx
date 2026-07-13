import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildMemoryStage, computeStars, computeXp } from "@/lib/stage-builders";
import type { LevelId } from "@/data/games";
import { getEmoji, translatePair } from "@/data/games";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

interface MemoryGameProps {
  level: LevelId;
  stage: number;
  onComplete: (stars: 1 | 2 | 3, xp: number) => void;
  onProgress?: (current: number, total: number) => void;
}

interface Card {
  id: string;
  pairId: string;
  text: string;
  lang: "es" | "tr";
  emoji: string;
}

export const MemoryGame = ({ level, stage, onComplete, onProgress }: MemoryGameProps) => {
  const { locale, t } = useLanguage();
  const data = useMemo(() => buildMemoryStage(level, stage), [level, stage]);

  const initialCards = useMemo<Card[]>(() => {
    const cards: Card[] = [];
    data.pairs.forEach((p, i) => {
      const emoji = getEmoji(p.es);
      cards.push({ id: `es-${i}`, pairId: `${i}`, text: p.es, lang: "es", emoji });
      cards.push({
        id: `tr-${i}`,
        pairId: `${i}`,
        text: translatePair(p, locale),
        lang: "tr",
        emoji,
      });
    });
    return cards
      .map((c) => ({ c, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map(({ c }) => c);
  }, [data, locale]);

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set()); // pairIds já casados
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setCards(initialCards);
    setFlipped([]);
    setMatched(new Set());
    setAttempts(0);
  }, [initialCards]);

  useEffect(() => {
    onProgress?.(matched.size, data.pairs.length);
    if (matched.size === data.pairs.length && data.pairs.length > 0) {
      const minAttempts = data.pairs.length;
      const ratio = Math.min(1, minAttempts / Math.max(minAttempts, attempts));
      const stars = computeStars(ratio);
      const xp = computeXp(stars, level);
      const timer = setTimeout(() => onComplete(stars, xp), 600);
      return () => clearTimeout(timer);
    }
  }, [matched, attempts, data.pairs.length, level, onComplete, onProgress]);

  const handleFlip = (card: Card) => {
    if (flipped.length === 2) return;
    if (flipped.includes(card.id)) return;
    if (matched.has(card.pairId)) return;

    const next = [...flipped, card.id];
    setFlipped(next);

    if (next.length === 2) {
      setAttempts((a) => a + 1);
      const [a, b] = next.map((id) => cards.find((c) => c.id === id)!);
      if (a.pairId === b.pairId) {
        setTimeout(() => {
          setMatched((prev) => new Set(prev).add(a.pairId));
          setFlipped([]);
        }, 450);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const cols = data.pairs.length <= 6 ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-4";
  const themeLabel = locale === "en" ? data.themeEn : data.theme;
  const trLabel = locale === "en" ? "EN" : "PT";

  return (
    <div>
      <div className="text-center mb-5">
        <p className="text-sm text-muted-foreground">
          {t.jogos.memory.encuentraPares} · {t.jogos.memory.tema}:{" "}
          <span className="font-semibold text-foreground">{themeLabel} · {level}</span>
        </p>
      </div>
      <div className={cn("grid gap-2.5 md:gap-3 max-w-3xl mx-auto", cols)}>
        {cards.map((card) => {
          const isMatched = matched.has(card.pairId);
          const isFlipped = flipped.includes(card.id) || isMatched;
          return (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative aspect-[3/4] rounded-2xl border-2 font-semibold text-sm md:text-base transition-colors duration-200 select-none",
                isMatched
                  ? "bg-success/15 border-success text-success"
                  : isFlipped
                    ? card.lang === "es"
                      ? "bg-card border-primary/50 text-primary"
                      : "bg-card border-secondary text-foreground"
                    : "bg-gradient-spain border-transparent text-primary-foreground hover:shadow-card",
              )}
              aria-label={isFlipped ? card.text : t.jogos.memory.cartaOculta}
            >
              <AnimatePresence mode="wait">
                {isFlipped ? (
                  <motion.span
                    key="front"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center gap-1"
                  >
                    <span className="text-3xl md:text-4xl leading-none" aria-hidden>
                      {card.emoji}
                    </span>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-70">
                      {card.lang === "es" ? "ES" : trLabel}
                    </span>
                    <span className="text-xs md:text-sm font-semibold leading-tight">{card.text}</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="back"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center text-2xl"
                  >
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      <div className="text-center mt-5 text-sm text-muted-foreground">
        {t.jogos.memory.intentos}: <span className="font-bold text-foreground">{attempts}</span>
      </div>
    </div>
  );
};
