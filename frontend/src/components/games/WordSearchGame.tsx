import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { buildWordSearchStage, computeStars, computeXp } from "@/lib/stage-builders";
import type { LevelId } from "@/data/games";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface WordSearchGameProps {
  level: LevelId;
  stage: number;
  onComplete: (stars: 1 | 2 | 3, xp: number) => void;
  onProgress?: (current: number, total: number) => void;
}

const cellKey = (r: number, c: number) => `${r}-${c}`;

export const WordSearchGame = ({ level, stage, onComplete, onProgress }: WordSearchGameProps) => {
  const { locale, t } = useLanguage();
  const data = useMemo(() => buildWordSearchStage(level, stage), [level, stage]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState<[number, number][]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFound(new Set());
    setSelecting([]);
    setAttempts(0);
  }, [level, stage]);

  useEffect(() => {
    onProgress?.(found.size, data.words.length);
    if (data.words.length > 0 && found.size === data.words.length) {
      const ratio = Math.min(1, data.words.length / Math.max(data.words.length, attempts));
      const stars = computeStars(ratio);
      const xp = computeXp(stars, level);
      const timer = setTimeout(() => onComplete(stars, xp), 500);
      return () => clearTimeout(timer);
    }
  }, [found, data.words.length, attempts, level, onComplete, onProgress]);

  const isLineValid = (cells: [number, number][]): boolean => {
    if (cells.length < 2) return true;
    const [r0, c0] = cells[0];
    const [r1, c1] = cells[1];
    const dr = Math.sign(r1 - r0);
    const dc = Math.sign(c1 - c0);
    for (let i = 1; i < cells.length; i++) {
      const expected: [number, number] = [r0 + dr * i, c0 + dc * i];
      if (cells[i][0] !== expected[0] || cells[i][1] !== expected[1]) return false;
    }
    return true;
  };

  const handleStart = (r: number, c: number) => setSelecting([[r, c]]);

  const handleEnter = (r: number, c: number) => {
    if (selecting.length === 0) return;
    const last = selecting[selecting.length - 1];
    if (last[0] === r && last[1] === c) return;
    if (selecting.some(([rr, cc]) => rr === r && cc === c)) return;
    const next: [number, number][] = [...selecting, [r, c]];
    if (isLineValid(next)) setSelecting(next);
  };

  const handleEnd = () => {
    if (selecting.length < 2) {
      setSelecting([]);
      return;
    }
    const word = selecting.map(([r, c]) => data.grid[r][c]).join("");
    const reversed = word.split("").reverse().join("");
    const match = data.words.find(
      (w) => !found.has(w.word) && (w.word === word || w.word === reversed),
    );
    if (match) {
      setFound((prev) => new Set(prev).add(match.word));
    } else {
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 350);
    }
    setAttempts((a) => a + 1);
    setSelecting([]);
  };

  const selectingSet = new Set(selecting.map(([r, c]) => cellKey(r, c)));
  const foundCells = new Set<string>();
  data.words.forEach((w) => {
    if (found.has(w.word)) w.cells.forEach(([r, c]) => foundCells.add(cellKey(r, c)));
  });

  return (
    <div className="grid lg:grid-cols-[1fr_220px] gap-6 items-start">
      <div
        ref={wrapRef}
        className={cn(
          "bg-card rounded-3xl border border-border p-3 md:p-5 shadow-card select-none",
          wrongFlash && "animate-shake",
        )}
        onMouseLeave={handleEnd}
        onMouseUp={handleEnd}
        onTouchEnd={handleEnd}
      >
        <div
          className="grid gap-1 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${data.size}, minmax(0, 1fr))`,
            maxWidth: `${data.size * 44}px`,
          }}
        >
          {data.grid.map((row, r) =>
            row.map((ch, c) => {
              const k = cellKey(r, c);
              const isFound = foundCells.has(k);
              const isSelecting = selectingSet.has(k);
              return (
                <button
                  key={k}
                  onMouseDown={() => handleStart(r, c)}
                  onMouseEnter={(e) => {
                    if (e.buttons === 1) handleEnter(r, c);
                  }}
                  onTouchStart={() => handleStart(r, c)}
                  onTouchMove={(e) => {
                    const t = e.touches[0];
                    const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
                    const dataAttr = el?.getAttribute?.("data-cell");
                    if (dataAttr) {
                      const [rr, cc] = dataAttr.split("-").map(Number);
                      handleEnter(rr, cc);
                    }
                  }}
                  data-cell={k}
                  className={cn(
                    "aspect-square rounded-md font-display font-bold text-sm md:text-base flex items-center justify-center transition-colors",
                    isFound
                      ? "bg-success text-success-foreground"
                      : isSelecting
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted/40 hover:bg-accent text-foreground",
                  )}
                >
                  {ch}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border p-5 shadow-card">
        <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-3">
          {t.jogos.wordSearch.palabras} ({found.size}/{data.words.length})
        </div>
        <ul className="space-y-2">
          {data.words.map((w) => {
            const done = found.has(w.word);
            const tr = locale === "en" ? w.en : w.pt;
            return (
              <motion.li
                key={w.word}
                animate={done ? { scale: [1, 1.06, 1] } : {}}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl border text-sm",
                  done
                    ? "bg-success/10 border-success/30 text-success line-through"
                    : "bg-background border-border",
                )}
              >
                <div>
                  <div className="font-semibold">{w.word.toLowerCase()}</div>
                  <div className="text-[11px] text-muted-foreground">{tr}</div>
                </div>
                {done && <Check className="w-4 h-4" />}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
