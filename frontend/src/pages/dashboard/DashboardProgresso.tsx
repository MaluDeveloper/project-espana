import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, TrendingUp, CheckCircle2, Lock, ArrowRight, History } from "lucide-react";
import { useT, useLanguage } from "@/i18n/LanguageContext";
import { COURSE, pickL } from "@/data/courses";
import { getLevelCompletionPercent, isLevelUnlocked } from "@/lib/course-progress";
import {
  getOverallCompletionPercent,
  getOverallAvgQuiz,
  getCompletedChaptersTotal,
  getTotalStudyMinutes,
  formatStudyTime,
  getWeekActivity,
  getQuizHistory,
} from "@/lib/dashboard-stats";

const DashboardProgresso = () => {
  const t = useT();
  const v = t.dashboardViews.progresso;
  const { locale } = useLanguage();

  const overall = useMemo(() => getOverallCompletionPercent(), []);
  const studyMin = useMemo(() => getTotalStudyMinutes(), []);
  const completedChapters = useMemo(() => getCompletedChaptersTotal(), []);
  const avgQuiz = useMemo(() => getOverallAvgQuiz(), []);
  const week = useMemo(() => getWeekActivity(), []);
  const history = useMemo(() => getQuizHistory(10), []);

  const maxMin = Math.max(1, ...week.map((d) => d.minutes));

  const stats = [
    { label: v.cards.geral, value: `${overall}%`, icon: TrendingUp, accent: "bg-primary/10 text-primary" },
    { label: v.cards.tempo, value: formatStudyTime(studyMin), icon: Clock, accent: "bg-tertiary/10 text-tertiary" },
    { label: v.cards.capitulos, value: String(completedChapters), icon: CheckCircle2, accent: "bg-success/10 text-success" },
    { label: v.cards.mediaQuiz, value: avgQuiz ? `${avgQuiz}%` : "—", icon: Trophy, accent: "bg-secondary/30 text-foreground" },
  ];

  const levelStatusInfo = (level: (typeof COURSE)[number]) => {
    const pct = getLevelCompletionPercent(level.level);
    const unlocked = isLevelUnlocked(level.level);
    if (!unlocked) return { label: "Bloqueado", cls: "bg-muted text-muted-foreground", pct, unlocked };
    if (pct >= 80) return { label: "Concluído", cls: "bg-success/15 text-success border-success/30", pct, unlocked };
    if (pct > 0) return { label: "Em andamento", cls: "bg-secondary/30 text-foreground border-secondary/50", pct, unlocked };
    return { label: "Não iniciado", cls: "bg-card text-muted-foreground border-border", pct, unlocked };
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl mb-2">{v.titulo}</h1>
        <p className="text-muted-foreground text-base md:text-lg">{v.subtitulo}</p>
      </motion.div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-card rounded-2xl p-5 border border-border shadow-card"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.accent}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{s.label}</div>
            <div className="font-display text-2xl">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Atividade da semana */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card"
      >
        <div className="mb-6">
          <h2 className="font-display text-2xl mb-1">{v.semana}</h2>
          <p className="text-sm text-muted-foreground">{v.semanaSub}</p>
        </div>

        <div className="flex items-end justify-between gap-2 md:gap-4 h-48">
          {week.map((d, i) => {
            const h = d.studied ? Math.round((d.minutes / maxMin) * 100) : 0;
            return (
              <div key={d.dayIso} className="flex-1 flex flex-col items-center gap-2 h-full">
                <div className="flex-1 w-full flex items-end">
                  {d.studied ? (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-primary to-primary-glow rounded-t-xl relative group"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-0.5 rounded">
                        {d.minutes}m
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-full h-1.5 rounded-full bg-muted" />
                  )}
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{d.label}</span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Progresso por nível */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card"
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl">{v.niveis}</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {COURSE.map((course) => {
            const info = levelStatusInfo(course);
            const card = (
              <div
                className={`rounded-2xl p-4 border transition-all ${
                  info.unlocked
                    ? "bg-gradient-warm border-border hover:border-primary/40 hover:-translate-y-0.5 shadow-sm"
                    : "bg-muted/30 border-border opacity-70"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl">{course.level}</span>
                    {!info.unlocked && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${info.cls}`}>
                    {info.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                  {t.cursos.listing.levels?.[course.level]?.title ?? course.title}
                </p>
                <div className="flex items-center gap-2">
                  <Progress value={info.pct} className="h-2 flex-1" />
                  <span className="text-xs font-bold tabular-nums w-10 text-right">{info.pct}%</span>
                </div>
              </div>
            );
            return info.unlocked ? (
              <Link key={course.level} to={`/cursos/${course.level}`}>
                {card}
              </Link>
            ) : (
              <div key={course.level}>{card}</div>
            );
          })}
        </div>
      </motion.section>

      {/* Histórico de quizzes */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card"
      >
        <div className="flex items-center gap-2 mb-5">
          <History className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl">{v.historico}</h2>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {v.semHistorico}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {history.map((q) => {
              const pct = Math.round((q.score / q.total) * 100);
              const passed = pct >= 70;
              return (
                <li
                  key={`${q.level}-${q.chapterId}-${q.takenAt}`}
                  className="py-3 flex items-center gap-3"
                >
                  <Badge variant="outline" className="shrink-0">{q.level}</Badge>
                  <Link
                    to={`/cursos/${q.level}/capitulo/${q.chapterId}`}
                    className="flex-1 min-w-0 hover:text-primary"
                  >
                    <p className="font-semibold text-sm truncate">{pickL(q.chapterTitle, q.chapterTitleEn, locale)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(q.takenAt)}</p>
                  </Link>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-bold tabular-nums ${passed ? "text-success" : "text-destructive"}`}>
                      {q.score}/{q.total} · {pct}%
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </li>
              );
            })}
          </ul>
        )}
      </motion.section>
    </div>
  );
};

export default DashboardProgresso;
