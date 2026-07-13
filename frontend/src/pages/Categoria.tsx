import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/Stars";
import { getCategory, LEVELS, type LevelId } from "@/data/games";
import { getLevelStats, getStageResult, isStageUnlocked } from "@/lib/progress";
import { isLevelUnlocked as isCourseLevelUnlocked } from "@/lib/course-progress";
import { ArrowLeft, Lock, Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageContext";

// Estrelas progressivas: preenche conforme as fases vão sendo concluídas.
const progressStars = (completed: number, total: number): 0 | 1 | 2 | 3 => {
  if (total <= 0) return 0;
  const ratio = completed / total;
  if (ratio >= 1) return 3;
  if (ratio >= 2 / 3) return 2;
  if (ratio >= 1 / 3) return 1;
  return 0;
};

const Categoria = () => {
  const { catId } = useParams<{ catId: string }>();
  const t = useT();
  const cat = catId ? getCategory(catId) : undefined;
  const [level, setLevel] = useState<LevelId>("A1");
  const stages = useMemo(
    () => Array.from({ length: cat?.totalStages ?? 0 }, (_, i) => i + 1),
    [cat?.totalStages],
  );

  if (!cat) return <Navigate to="/jogos" replace />;
  if (!cat.available) return <Navigate to="/jogos" replace />;

  const Icon = cat.icon;
  const stats = getLevelStats(cat.id, level);
  const levelLocked = !isCourseLevelUnlocked(level);
  const tCat = t.jogos.categories[cat.id] ?? {
    title: cat.title,
    tagline: cat.tagline,
    description: cat.description,
  };

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/dashboard/jogos">
          <ArrowLeft className="w-4 h-4" /> {t.jogos.categoria.voltar}
        </Link>
      </Button>

      <div className="grid md:grid-cols-[auto_1fr] gap-5 items-center mb-8">
        <div className="w-20 h-20 rounded-3xl bg-card border border-border shadow-card flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            {tCat.tagline}
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-1">{tCat.title}</h1>
          <p className="text-muted-foreground">{tCat.description}</p>
        </div>
      </div>

      {/* Selector de nivel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {LEVELS.map((lv) => {
          const active = lv.id === level;
          const lvStats = getLevelStats(cat.id, lv.id);
          const lvLocked = !isCourseLevelUnlocked(lv.id);
          const lvLabel = t.jogos.levels.labels[lv.id] ?? lv.label;
          return (
            <button
              key={lv.id}
              onClick={() => setLevel(lv.id)}
              className={cn(
                "shrink-0 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all",
                active
                  ? "bg-gradient-spain text-primary-foreground border-transparent shadow-card"
                  : "bg-card border-border hover:border-primary/40",
                lvLocked && !active && "opacity-60",
              )}
            >
              <div className="flex items-center gap-2">
                {lvLocked && <Lock className="w-3.5 h-3.5" />}
                <span className="font-display font-bold">{lv.id}</span>
                <span className={cn("text-xs", active ? "opacity-90" : "text-muted-foreground")}>
                  {lvLabel}
                </span>
                {lvStats.completed > 0 && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                      active ? "bg-primary-foreground/20" : "bg-secondary/40",
                    )}
                  >
                    {lvStats.completed}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 md:p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs text-muted-foreground">{t.jogos.categoria.progresso(level)}</div>
          <div className="font-display text-xl">
            {t.jogos.categoria.fasesXp(stats.completed, cat.totalStages, stats.xp)}
          </div>
        </div>
        <Stars value={progressStars(stats.completed, cat.totalStages)} />
      </div>

      {levelLocked ? (
        <div className="bg-card rounded-3xl border border-dashed border-border p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl md:text-2xl mb-2">
            {t.jogos.categoria.nivelBloqueadoTitulo(level)}
          </h3>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto">
            {t.jogos.categoria.nivelBloqueadoDesc(level)}
          </p>
          <Button asChild variant="spain">
            <Link to="/dashboard/cursos">{t.jogos.categoria.irCurso}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {stages.map((stage, i) => {
            const unlocked = isStageUnlocked(cat.id, level, stage);
            const result = getStageResult(cat.id, level, stage);
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.01 }}
              >
                {unlocked ? (
                  <Link
                    to={`/jogos/${cat.id}/${level}/${stage}`}
                    className={cn(
                      "group relative aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 transition-all hover:-translate-y-1 hover:shadow-elevated",
                      result
                        ? "bg-gradient-to-br from-success/15 to-success/5 border-success/30"
                        : "bg-card border-border hover:border-primary/40",
                    )}
                  >
                    <div className="font-display text-2xl font-bold mb-1">{stage}</div>
                    {result ? (
                      <Stars value={result.stars} size="sm" />
                    ) : (
                      <Play className="w-4 h-4 text-primary" />
                    )}
                    {result && (
                      <CheckCircle2 className="absolute top-1.5 right-1.5 w-4 h-4 text-success" />
                    )}
                  </Link>
                ) : (
                  <div
                    className="aspect-square rounded-2xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center text-muted-foreground"
                    aria-label={t.jogos.categoria.faseBloqueada(stage)}
                  >
                    <Lock className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">{stage}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Categoria;
