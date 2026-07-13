import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Lock, Trophy, FileText } from "lucide-react";
import { getCourseLevel, pickL } from "@/data/courses";
import {
  getChapterProgress,
  getExam,
  isLevelUnlocked,
  getChapterCompletionPercent,
  isChapterUnlocked,
  isChapterCompleted,
  isChapterFullyComplete,
  getLevelCompletionPercent,
  UNLOCK_THRESHOLD,
} from "@/lib/course-progress";
import type { LevelId } from "@/data/games";
import { useLanguage } from "@/i18n/LanguageContext";

const NivelCurso = () => {
  const { level } = useParams<{ level: string }>();
  const course = level ? getCourseLevel(level as LevelId) : undefined;
  const { locale, t } = useLanguage();
  const tn = t.cursos.nivel;
  const tc = t.cursos.listing;

  if (!course || !isLevelUnlocked(course.level)) {
    return <Navigate to="/cursos" replace />;
  }

  const exam = getExam(course.level);
  const levelPct = getLevelCompletionPercent(course.level);
  const allChaptersStarted = course.chapters.every((c) => {
    const p = getChapterProgress(course.level, c.id);
    return p.topicsRead.length > 0;
  });

  const localized = tc.levels?.[course.level] ?? { title: course.title, description: course.description };

  return (
    <>
      <Link to="/dashboard/cursos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> {tn.voltar}
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Badge variant="outline" className="font-bold mb-3">{course.level}</Badge>
        <h1 className="font-display text-3xl md:text-4xl mb-2">{localized.title}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-4">{localized.description}</p>
        <div className="max-w-md">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-muted-foreground">
            <span>{course.level} · {levelPct}%</span>
            <span className="tabular-nums">{course.chapters.filter((c) => isChapterCompleted(course.level, c.id)).length}/{course.chapters.length}</span>
          </div>
          <Progress value={levelPct} className="h-2" />
        </div>
      </motion.div>

      <div className="grid gap-4 mb-8">
        {course.chapters.map((ch, i) => {
          const pct = getChapterCompletionPercent(course.level, ch.id);
          const completed = isChapterCompleted(course.level, ch.id);
          const fully = isChapterFullyComplete(course.level, ch.id);
          const unlocked = isChapterUnlocked(course.level, ch.id);
          const prevChapter = i > 0 ? course.chapters[i - 1] : undefined;
          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-card rounded-3xl p-5 md:p-6 border border-border shadow-card transition-shadow ${
                !unlocked ? "opacity-60" : "hover:shadow-elevated"
              }`}
            >
              <div className="grid grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-display text-lg sm:text-xl truncate">{pickL(ch.title, ch.titleEn, locale)}</h3>
                    {fully && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Concluído
                      </Badge>
                    )}
                    {completed && !fully && <CheckCircle2 className="w-5 h-5 text-success shrink-0" />}
                    {!unlocked && <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{pickL(ch.summary, ch.summaryEn, locale)}</p>
                  {unlocked ? (
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-1.5 flex-1 max-w-xs" />
                      <span className="text-xs font-bold tabular-nums text-muted-foreground w-10 text-right">{pct}%</span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      Complete {UNLOCK_THRESHOLD}% do capítulo {prevChapter?.number} para desbloquear
                    </p>
                  )}
                </div>
                {unlocked ? (
                  <Button asChild variant={fully ? "outline" : "spain"} size="sm" className="sm:h-10 sm:px-4">
                    <Link to={`/cursos/${course.level}/capitulo/${ch.id}`}>
                      <span className="hidden sm:inline">{pct > 0 ? tn.continuar : tn.ler}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled size="sm" variant="outline" className="sm:h-10 sm:px-4">
                    <Lock className="w-4 h-4" />
                  </Button>
                )}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-spain flex items-center justify-center text-primary-foreground font-display text-lg sm:text-xl font-bold shrink-0">
                  {ch.number}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Prova final */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden bg-gradient-spain rounded-3xl p-6 md:p-8 text-primary-foreground shadow-elevated"
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-secondary/30 blur-2xl" />
        <div className="relative grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-5 items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">{tn.provaEyebrow}</div>
            <h3 className="font-display text-2xl mb-1">{tn.provaTitulo}</h3>
            <p className="text-primary-foreground/90 text-sm">
              {exam ? tn.melhorNotaFmt(exam.score, exam.total, exam.passed) : tn.naoFeita}
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="font-bold">
            <Link to={`/cursos/${course.level}/prueba`}>
              <FileText className="w-4 h-4" /> {exam ? tn.repetir : tn.fazer}
            </Link>
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default NivelCurso;

