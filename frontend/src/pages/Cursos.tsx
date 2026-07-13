import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, CheckCircle2, ArrowRight, GraduationCap } from "lucide-react";
import { COURSE } from "@/data/courses";
import {
  isLevelUnlocked,
  isLevelPassed,
  getExam,
  getLevelCompletionPercent,
  getLevelStats,
  getCurrentChapterNumber,
  getPreviousLevel,
  UNLOCK_THRESHOLD,
} from "@/lib/course-progress";

const Cursos = () => {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-secondary/40 text-xs font-bold mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-primary" /> Libro online · A1 → C2
        </div>
        <h1 className="font-display text-3xl md:text-5xl mb-2">
          Tu <span className="text-gradient-spain">curso completo</span> de español
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Capítulos con teoría, ejemplos, léxico profesional y ejercicios. Completa el 80% del nivel para desbloquear el siguiente.
        </p>
      </motion.div>

      <div className="grid gap-5">
        {COURSE.map((course, i) => {
          const unlocked = isLevelUnlocked(course.level);
          const passed = isLevelPassed(course.level);
          const exam = getExam(course.level);
          const pct = getLevelCompletionPercent(course.level);
          const stats = getLevelStats(course.level);
          const currentChapter = getCurrentChapterNumber(course.level);
          const started = pct > 0;
          const concluido = pct >= UNLOCK_THRESHOLD;
          const prevLevel = getPreviousLevel(course.level);
          return (
            <motion.div
              key={course.level}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card ${
                !unlocked ? "opacity-60" : "hover:shadow-elevated transition-shadow"
              }`}
            >
              <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="font-bold">{course.level}</Badge>
                    {concluido && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Concluído
                      </Badge>
                    )}
                    {passed && !concluido && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Aprobado
                      </Badge>
                    )}
                    {!unlocked && (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </Badge>
                    )}
                  </div>
                  <h2 className="font-display text-2xl mb-1">{course.title}</h2>
                  <p className="text-muted-foreground mb-3">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap mb-3">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {course.chapters.length} capítulos</span>
                    {exam && (
                      <span className="font-semibold text-foreground">
                        Mejor nota: {exam.score}/{exam.total}
                      </span>
                    )}
                  </div>
                  {unlocked ? (
                    <div className="max-w-md">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1 text-muted-foreground">
                        <span>
                          {started
                            ? `Capítulo ${currentChapter} de ${stats.totalChapters}`
                            : "Aún no empezado"}
                        </span>
                        <span className="tabular-nums">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Completa el {UNLOCK_THRESHOLD}% del nivel {prevLevel} para desbloquear
                    </p>
                  )}
                </div>
                {unlocked ? (
                  <Button asChild variant="spain" size="lg" className="font-bold">
                    <Link to={`/cursos/${course.level}`}>
                      {concluido ? "Repasar" : started ? "Continuar" : "Empezar"} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline">
                    <Lock className="w-4 h-4" /> Bloqueado
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default Cursos;
