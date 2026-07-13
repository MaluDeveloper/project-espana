import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/Stars";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

interface StageCompleteProps {
  open: boolean;
  stars: 1 | 2 | 3;
  xp: number;
  onNext?: () => void;
  onRetry: () => void;
  backHref: string;
  hasNext: boolean;
  completedStages?: number;
  totalStages?: number;
}

export const StageComplete = ({
  open,
  stars,
  xp,
  onNext,
  onRetry,
  backHref,
  hasNext,
  completedStages,
  totalStages,
}: StageCompleteProps) => {
  const t = useT();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="bg-card rounded-3xl shadow-elevated border border-border max-w-md w-full p-8 text-center"
          >
            <h2 className="font-display text-3xl mb-2">{t.jogos.stageComplete.titulo}</h2>
            <p className="text-muted-foreground mb-5">{t.jogos.stageComplete.subtitulo}</p>
            <div className="flex justify-center mb-5">
              <Stars value={stars} size="lg" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/30 border border-secondary/40 text-sm font-bold mb-3">
              <Sparkles className="w-4 h-4 text-primary" /> +{xp} XP
            </div>
            {typeof completedStages === "number" && typeof totalStages === "number" && (
              <p className="text-sm text-muted-foreground mb-5">
                {t.jogos.stageComplete.fasesCompletadas}:{" "}
                <span className="font-bold text-foreground">{completedStages}</span> / {totalStages}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button variant="outline" onClick={onRetry} className="flex-1">
                <RotateCcw className="w-4 h-4" /> {t.jogos.stageComplete.repetir}
              </Button>
              {hasNext && onNext && (
                <Button variant="spain" onClick={onNext} className="flex-1">
                  {t.jogos.stageComplete.proxFase} <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              <Button asChild variant={hasNext ? "ghost" : "spain"} className="flex-1">
                <Link to={backHref}>
                  {t.jogos.stageComplete.voltar} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
