import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import type { LexiconEntry } from "@/data/courses";
import { AudioButton } from "./AudioButton";
import { registerFlashcardSeen } from "@/lib/dashboard-stats";
import { getShowTranslation } from "@/lib/preferences";

interface FlashcardsProps {
  entries: LexiconEntry[];
  locale: "pt" | "en";
  labels: {
    front: string;
    back: string;
    know: string;
    review: string;
    completed: string;
    restart: string;
    flip: string;
    of: string;
  };
}

export const Flashcards = ({ entries, locale, labels }: FlashcardsProps) => {
  const initial = useMemo(() => entries.map((_, i) => i), [entries]);
  const [queue, setQueue] = useState<number[]>(initial);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const showTranslation = getShowTranslation();

  if (!entries.length) return null;

  const restart = () => {
    setQueue(initial);
    setFlipped(false);
    setKnown(0);
    setFinished(false);
  };

  if (finished || queue.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-success/10 border border-success/30 text-center">
        <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
        <h4 className="font-display text-xl mb-1">{labels.completed}</h4>
        <p className="text-sm text-muted-foreground mb-4">
          {known} / {entries.length}
        </p>
        <Button onClick={restart} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4" /> {labels.restart}
        </Button>
      </div>
    );
  }

  const idx = queue[0];
  const card = entries[idx];

  const handleKnow = () => {
    const next = queue.slice(1);
    setKnown((k) => k + 1);
    setFlipped(false);
    registerFlashcardSeen();
    if (!next.length) setFinished(true);
    setQueue(next);
  };

  const handleReview = () => {
    setQueue((q) => [...q.slice(1), q[0]]);
    setFlipped(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
        <span>{entries.length - queue.length + 1} {labels.of} {entries.length}</span>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="w-3 h-3" /> {known} {labels.know.toLowerCase()}
        </Badge>
      </div>

      <div className="relative h-56 [perspective:1000px]" onClick={() => setFlipped((f) => !f)}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${idx}-${flipped}`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-3xl border-2 border-border bg-gradient-warm shadow-card cursor-pointer flex flex-col items-center justify-center p-6 text-center"
          >
            {!flipped ? (
              <>
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-3">{labels.front}</div>
                <div className="font-display text-3xl md:text-4xl mb-2">{card.es}</div>
                <div className="flex items-center gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                  <AudioButton text={card.es} />
                  <AudioButton text={card.es} slow label="0.6×" />
                </div>
                <div className="text-xs text-muted-foreground mt-3">{labels.flip}</div>
              </>
            ) : (
              <>
                <div className="text-xs font-bold uppercase tracking-wider text-secondary-foreground mb-3">{labels.back}</div>
                {showTranslation ? (
                  <div className="font-display text-2xl md:text-3xl mb-2">
                    {locale === "en" && card.en ? card.en : card.pt}
                  </div>
                ) : (
                  <div className="font-display text-2xl md:text-3xl mb-2 text-muted-foreground italic">
                    ¿…?
                  </div>
                )}
                {card.example && <div className="text-sm italic text-muted-foreground mt-2">"{card.example}"</div>}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={handleReview}>
          <RotateCcw className="w-4 h-4" /> {labels.review}
        </Button>
        <Button variant="spain" onClick={handleKnow}>
          <CheckCircle2 className="w-4 h-4" /> {labels.know}
        </Button>
      </div>
    </div>
  );
};
