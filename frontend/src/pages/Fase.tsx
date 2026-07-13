import { useCallback, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { GameShell } from "@/components/GameShell";
import { StageComplete } from "@/components/StageComplete";
import { MemoryGame } from "@/components/games/MemoryGame";
import { WordSearchGame } from "@/components/games/WordSearchGame";
import { GapsGame } from "@/components/games/GapsGame";
import { getCategory, LEVELS, type LevelId } from "@/data/games";
import { saveStage, getLevelStats } from "@/lib/progress";
import { isLevelUnlocked as isCourseLevelUnlocked } from "@/lib/course-progress";
import { useT } from "@/i18n/LanguageContext";

const Fase = () => {
  const { catId, level, stage } = useParams<{ catId: string; level: string; stage: string }>();
  const navigate = useNavigate();
  const t = useT();

  const cat = catId ? getCategory(catId) : undefined;
  const lv = LEVELS.find((l) => l.id === level)?.id as LevelId | undefined;
  const stageNum = stage ? parseInt(stage, 10) : NaN;

  const [done, setDone] = useState<{ stars: 1 | 2 | 3; xp: number } | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 1 });
  const [retryKey, setRetryKey] = useState(0);

  const handleComplete = useCallback(
    (stars: 1 | 2 | 3, xp: number) => {
      if (!cat || !lv || isNaN(stageNum)) return;
      saveStage(cat.id, lv, stageNum, { stars, xp, completedAt: Date.now() });
      setDone({ stars, xp });
    },
    [cat, lv, stageNum],
  );

  const handleProgress = useCallback((current: number, total: number) => {
    setProgress((prev) =>
      prev.current === current && prev.total === total ? prev : { current, total },
    );
  }, []);

  if (!cat || !cat.available || !lv || isNaN(stageNum) || stageNum < 1 || stageNum > cat.totalStages) {
    return <Navigate to="/jogos" replace />;
  }
  if (!isCourseLevelUnlocked(lv)) {
    return <Navigate to={`/jogos/${cat.id}`} replace />;
  }

  const handleRetry = () => {
    setDone(null);
    setProgress({ current: 0, total: 1 });
    setRetryKey((k) => k + 1);
  };

  const hasNext = stageNum < cat.totalStages;
  const handleNext = () => {
    setDone(null);
    setProgress({ current: 0, total: 1 });
    setRetryKey(0);
    navigate(`/jogos/${cat.id}/${lv}/${stageNum + 1}`);
  };

  const renderGame = () => {
    const props = {
      key: retryKey,
      level: lv,
      stage: stageNum,
      onComplete: handleComplete,
      onProgress: handleProgress,
    };
    switch (cat.id) {
      case "memoria":
        return <MemoryGame {...props} />;
      case "caza-palabras":
        return <WordSearchGame {...props} />;
      case "lacunas":
        return <GapsGame {...props} />;
      default:
        return null;
    }
  };

  const tCat = t.jogos.categories[cat.id] ?? { title: cat.title };

  return (
    <>
      <GameShell
        title={t.jogos.fase.tituloFmt(tCat.title, stageNum)}
        subtitle={t.jogos.fase.nivelFmt(lv)}
        backHref={`/jogos/${cat.id}`}
        progress={progress.total > 1 ? progress : undefined}
      >
        {renderGame()}
        {done && hasNext && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-spain text-primary-foreground font-bold shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all"
            >
              {t.jogos.fase.siguienteFase} →
            </button>
          </div>
        )}
      </GameShell>
      <StageComplete
        open={!!done}
        stars={done?.stars ?? 1}
        xp={done?.xp ?? 0}
        onRetry={handleRetry}
        onNext={hasNext ? handleNext : undefined}
        hasNext={hasNext}
        backHref={`/jogos/${cat.id}`}
        completedStages={done ? getLevelStats(cat.id, lv).completed : undefined}
        totalStages={cat.totalStages}
      />
    </>
  );
};

export default Fase;
