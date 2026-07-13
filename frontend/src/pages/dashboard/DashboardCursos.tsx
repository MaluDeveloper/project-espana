import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, CheckCircle2, ArrowRight, GraduationCap, Award, Clock } from "lucide-react";
import { COURSE } from "@/data/courses";
import { DELE_COURSES } from "@/data/dele";
import { isLevelUnlocked, isLevelPassed, getExam, getLevelCompletionPercent, getLevelStats, getCurrentChapterNumber, getPreviousLevel, UNLOCK_THRESHOLD } from "@/lib/course-progress";
import { useT, useLanguage } from "@/i18n/LanguageContext";

const DashboardCursos = () => {
  const t = useT();
  const { locale } = useLanguage();
  const tc = t.cursos.listing;
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-secondary/40 text-xs font-bold mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-primary" /> {tc.badge}
        </div>
        <h1 className="font-display text-3xl md:text-4xl mb-2">
          {tc.titulo1} <span className="text-gradient-spain">{tc.tituloHighlight}</span> {tc.tituloFim}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
          {tc.subtitulo}
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
          const localized = tc.levels?.[course.level] ?? { title: course.title, description: course.description };
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
                        <CheckCircle2 className="w-3 h-3" /> {tc.concluido}
                      </Badge>
                    )}
                    {passed && !concluido && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {tc.aprovado}
                      </Badge>
                    )}
                    {!unlocked && (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="w-3 h-3" /> {tc.bloqueado}
                      </Badge>
                    )}
                  </div>
                  <h2 className="font-display text-2xl mb-1">{localized.title}</h2>
                  <p className="text-muted-foreground mb-3">{localized.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap mb-3">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {course.chapters.length} {tc.capitulos}</span>
                    {exam && (
                      <span className="font-semibold text-foreground">
                        {tc.melhorNota(exam.score, exam.total)}
                      </span>
                    )}
                  </div>
                  {unlocked ? (
                    <div className="max-w-md">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1 text-muted-foreground">
                        <span>
                          {started
                            ? tc.capituloFmt(currentChapter, stats.totalChapters)
                            : tc.aindaNaoIniciado}
                        </span>
                        <span className="tabular-nums">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      {tc.completePara(UNLOCK_THRESHOLD, prevLevel ?? "")}
                    </p>
                  )}
                </div>
                {unlocked ? (
                  <Button asChild variant="spain" size="lg" className="font-bold">
                    <Link to={`/cursos/${course.level}`}>
                      {concluido ? tc.repasar : started ? tc.continuar : tc.empezar} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline">
                    <Lock className="w-4 h-4" /> {tc.bloqueado}
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ───────── DELE — Certificações oficiais ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold mb-3">
          <Award className="w-3.5 h-3.5 text-primary" /> Instituto Cervantes
        </div>
        <h2 className="font-display text-2xl md:text-3xl mb-2">
          {locale === "en" ? (
            <><span className="text-gradient-spain">DELE</span> {tc.deleTitulo}</>
          ) : (
            <>{tc.deleTitulo} <span className="text-gradient-spain">DELE</span></>
          )}
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl">
          {tc.deleDescricao}
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        {DELE_COURSES.map((dele, i) => (
          <motion.div
            key={dele.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="relative bg-card rounded-3xl p-6 border border-border shadow-card hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="font-bold">{dele.level}</Badge>
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" /> {dele.duration}
              </Badge>
              <Badge className="bg-success text-success-foreground gap-1">
                <Award className="w-3 h-3" /> {dele.passScore}
              </Badge>
            </div>
            <h3 className="font-display text-xl mb-1">
              {locale === "en" && dele.titleEn ? dele.titleEn : dele.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {locale === "en" && dele.descriptionEn ? dele.descriptionEn : dele.description}
            </p>
            <Button asChild variant="spain" className="font-bold w-full sm:w-auto">
              <Link to={`/dele/${dele.id}`}>
                {tc.deleVerDetalhes} <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCursos;
