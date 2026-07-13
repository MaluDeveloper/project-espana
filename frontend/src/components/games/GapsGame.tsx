import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildGapsStage, computeStars, computeXp } from "@/lib/stage-builders";
import type { LevelId } from "@/data/games";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageContext";

interface GapsGameProps {
  level: LevelId;
  stage: number;
  onComplete: (stars: 1 | 2 | 3, xp: number) => void;
  onProgress?: (current: number, total: number) => void;
}

export const GapsGame = ({ level, stage, onComplete, onProgress }: GapsGameProps) => {
  const t = useT();
  const data = useMemo(() => buildGapsStage(level, stage), [level, stage]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    setIndex(0);
    setPicked(null);
    setCorrect(0);
  }, [level, stage]);

  useEffect(() => {
    onProgress?.(index, data.sentences.length);
  }, [index, data.sentences.length, onProgress]);

  const current = data.sentences[index];
  const finished = index >= data.sentences.length;

  useEffect(() => {
    if (finished) {
      const ratio = correct / data.sentences.length;
      const stars = computeStars(ratio);
      const xp = computeXp(stars, level);
      const timer = setTimeout(() => onComplete(stars, xp), 400);
      return () => clearTimeout(timer);
    }
  }, [finished, correct, data.sentences.length, level, onComplete]);

  const handlePick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === current.answer) setCorrect((c) => c + 1);
  };

  const handleNext = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  if (finished) {
    return (
      <div className="text-center py-12">
        <div className="font-display text-2xl mb-2">{t.jogos.gaps.calculando}</div>
        <p className="text-muted-foreground">
          {t.jogos.gaps.correctasFmt(correct, data.sentences.length)}
        </p>
      </div>
    );
  }

  const isCorrect = picked === current.answer;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-3xl border border-border shadow-card p-6 md:p-10">
        <div className="text-xs uppercase tracking-wider font-bold text-primary mb-2">
          {t.jogos.gaps.fraseFmt(index + 1, data.sentences.length)}
        </div>
        <div className="font-display text-2xl md:text-3xl leading-snug mb-2">
          {current.before}
          <span
            className={cn(
              "inline-flex min-w-[6ch] mx-1 px-3 py-0.5 rounded-xl border-b-4 align-middle",
              !picked && "border-primary/40 bg-accent/40",
              picked && isCorrect && "border-success bg-success/10 text-success",
              picked && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
            )}
          >
            {picked ?? "____"}
          </span>
          {current.after}
        </div>
        {current.hint && (
          <p className="text-sm text-muted-foreground italic mb-4">💡 {current.hint}</p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6">
          {current.options.map((opt) => {
            const state =
              !picked
                ? "idle"
                : opt === current.answer
                  ? "correct"
                  : opt === picked
                    ? "wrong"
                    : "muted";
            return (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.97 }}
                onClick={() => handlePick(opt)}
                disabled={!!picked}
                className={cn(
                  "px-4 py-3.5 rounded-2xl border-2 font-semibold text-base transition-all",
                  state === "idle" && "bg-card border-border hover:border-primary hover:bg-accent",
                  state === "correct" && "bg-success/15 border-success text-success",
                  state === "wrong" && "bg-destructive/10 border-destructive text-destructive",
                  state === "muted" && "bg-muted/40 border-border text-muted-foreground opacity-60",
                )}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {picked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-center justify-between gap-3"
            >
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold",
                  isCorrect
                    ? "bg-success/15 text-success"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {isCorrect ? t.jogos.gaps.muyBien : t.jogos.gaps.respuestaFmt(current.answer)}
              </div>
              <Button variant="spain" onClick={handleNext}>
                {t.jogos.gaps.siguiente} <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
