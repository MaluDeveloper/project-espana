import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Trophy,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Gamepad2,
  Crown,
  Medal,
  Award,
  Zap,
  CheckCircle2,
  TrendingUp,
  Lock,
} from "lucide-react";
import { GAME_CATEGORIES } from "@/data/games";
import { useT, useLanguage } from "@/i18n/LanguageContext";
import { COURSE, pickL } from "@/data/courses";
import {
  getLevelCompletionPercent,
  getLevelStats,
  getStreak,
  getRecommendedChapter,
  isLevelUnlocked,
  isLevelPassed,
} from "@/lib/course-progress";
import {
  getMissionsStatus,
  getMidnightCountdown,
  getAchievementsStatus,
  claimMissionRewards,
  getTotalXp,
} from "@/lib/dashboard-stats";
import { Link as RouterLink } from "react-router-dom";

// Calcula nível a partir do XP total acumulado (100 XP por nível).
const computeLevel = (xp: number) => {
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const xpToNext = level * 100;
  return { level, xpToNext };
};

// Concorrentes fictícios (não há backend com outros usuários reais ainda).
// A posição e o XP do próprio aluno, porém, são calculados a partir do XP real.
const MOCK_COMPETITORS = [
  { name: "Sofía M.", xp: 4820 },
  { name: "Carlos R.", xp: 4310 },
  { name: "Lucía P.", xp: 3990 },
  { name: "Javier T.", xp: 3650 },
  { name: "Elena V.", xp: 3300 },
  { name: "Mateo G.", xp: 3050 },
  { name: "Valentina S.", xp: 2800 },
  { name: "Diego H.", xp: 2600 },
  { name: "Camila R.", xp: 2400 },
  { name: "Pablo N.", xp: 2200 },
  { name: "Isabella F.", xp: 2050 },
  { name: "Adrián C.", xp: 1900 },
  { name: "Martina D.", xp: 1780 },
  { name: "Sebastián L.", xp: 1650 },
  { name: "Renata O.", xp: 1550 },
  { name: "Tomás A.", xp: 1450 },
  { name: "Julia B.", xp: 1370 },
  { name: "Marta L.", xp: 1305 },
  { name: "Nicolás E.", xp: 1250 },
  { name: "Diego F.", xp: 1180 },
  { name: "Alba M.", xp: 1100 },
  { name: "Rubén P.", xp: 1020 },
  { name: "Clara S.", xp: 940 },
  { name: "Hugo V.", xp: 860 },
];

const rankIcons = [Crown, Medal, Award];

const ACHIEVEMENT_ICONS: Record<string, string> = {
  primerPaso: "🎯",
  racha: "🔥",
  memoria: "🧠",
  poliglota: "📚",
  conversador: "💬",
  maestro: "👑",
  imparable: "⚡",
  fluente: "🏆",
};

const MISSION_ICONS = {
  capitulo: GraduationCap,
  partidas: Gamepad2,
  palavras: Sparkles,
} as const;

const DashboardHome = () => {
  const t = useT();
  const td = t.dashboard;
  const { locale } = useLanguage();
  const co = td.cursoOverview;

  // Identifica nível atual (último com progresso > 0, ou A1 por padrão)
  const currentLevelObj =
    [...COURSE].reverse().find((c) => isLevelUnlocked(c.level) && getLevelCompletionPercent(c.level) > 0) ?? COURSE[0];
  const currentPct = getLevelCompletionPercent(currentLevelObj.level);
  const currentStats = getLevelStats(currentLevelObj.level);
  const streak = getStreak();
  const recommended = getRecommendedChapter();

  // Estatísticas globais de todos os níveis
  const globalStats = COURSE.reduce(
    (acc, course) => {
      const stats = getLevelStats(course.level);
      acc.completedChapters += stats.completedChapters;
      acc.totalChapters += stats.totalChapters;
      if (isLevelPassed(course.level)) acc.passedLevels += 1;
      acc.totalQuizzes += stats.avgQuizScore > 0 ? 1 : 0;
      acc.quizSum += stats.avgQuizScore;
      return acc;
    },
    { completedChapters: 0, totalChapters: 0, passedLevels: 0, totalQuizzes: 0, quizSum: 0 },
  );
  const globalAvgQuiz = globalStats.totalQuizzes > 0 ? Math.round(globalStats.quizSum / globalStats.totalQuizzes) : 0;

  const userRaw = typeof window !== "undefined" ? localStorage.getItem("spanish-ai-user") : null;
  const user = userRaw ? JSON.parse(userRaw) : { name: "amigo" };

  // Auto-resgata recompensas de missões concluídas hoje (executa 1x ao montar)
  useEffect(() => {
    claimMissionRewards();
  }, []);

  // XP real = jogos + bônus de missões já reclamado
  const totalXp = getTotalXp();
  const { level: userLevel, xpToNext } = computeLevel(totalXp);

  // Posição no ranking: insere o XP real do aluno entre os concorrentes fictícios e ordena.
  const rankedList = useMemo(() => {
    const combined = [
      ...MOCK_COMPETITORS.map((r) => ({ ...r, you: false })),
      { name: td.ranking.voce, xp: totalXp, you: true },
    ].sort((a, b) => b.xp - a.xp);
    return combined.map((r, i) => ({ ...r, pos: i + 1 }));
  }, [totalXp, td.ranking.voce]);
  const rankPosition = rankedList.find((r) => r.you)!.pos;

  const userStats = {
    level: userLevel,
    xp: totalXp,
    xpToNext,
    streak,
    rankPosition,
  };

  const xpPct = Math.min(100, Math.round((userStats.xp / userStats.xpToNext) * 100));

  // Missões reais
  const missionsStatus = useMemo(() => getMissionsStatus(), []);
  const missionsDone = missionsStatus.filter((m) => m.done).length;

  // Countdown até a meia-noite (atualiza por minuto)
  const [resetIn, setResetIn] = useState(() => getMidnightCountdown());
  useEffect(() => {
    const id = setInterval(() => setResetIn(getMidnightCountdown()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Conquistas reais
  const achievementsStatus = useMemo(() => getAchievementsStatus(), []);
  const achievements = achievementsStatus.map((a) => ({
    id: a.id,
    icon: ACHIEVEMENT_ICONS[a.id],
    unlocked: a.unlocked,
    ...td.conquistas.items[a.id as keyof typeof td.conquistas.items],
  }));
  const unlockedCount = achievementsStatus.filter((a) => a.unlocked).length;

  // Exibe o pódio + os vizinhos imediatos da posição real do aluno.
  const ranking = useMemo(() => {
    const keepPositions = new Set<number>();
    [1, 2, 3, rankPosition - 1, rankPosition, rankPosition + 1].forEach((p) => {
      if (p >= 1 && p <= rankedList.length) keepPositions.add(p);
    });
    return rankedList.filter((r) => keepPositions.has(r.pos));
  }, [rankedList, rankPosition]);



  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero / Boas-vindas + nível */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-gradient-spain rounded-3xl p-6 md:p-8 text-primary-foreground shadow-elevated"
      >
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -left-8 -bottom-12 w-40 h-40 rounded-full bg-primary-foreground/10 blur-2xl" />

        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80 mb-2">
            {td.ola(user.name)}
          </div>
          <h1 className="font-display text-3xl md:text-5xl mb-3 leading-tight">
            {td.titulo1} <span className="text-secondary">{td.tituloHighlight}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/15 backdrop-blur border border-primary-foreground/20">
              <Crown className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold">
                {td.nivel} {userStats.level}
              </span>
              <span className="text-xs text-primary-foreground/80">· {td.intermedio}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/15 backdrop-blur border border-primary-foreground/20">
              <Flame className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold">
                {userStats.streak} {td.dias}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/15 backdrop-blur border border-primary-foreground/20">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold">#{userStats.rankPosition}</span>
              <span className="text-xs text-primary-foreground/80">{td.global}</span>
            </div>
          </div>

          <div className="max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-primary-foreground/90">
                {userStats.xp} / {userStats.xpToNext} XP
              </span>
              <span className="text-secondary">{td.proxNivel(userStats.level, userStats.xpToNext - userStats.xp)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-primary-foreground/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Visão geral do curso (única — números reais) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card"
      >
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
              <GraduationCap className="w-4 h-4" /> {co.eyebrow}
            </div>
            <h2 className="font-display text-2xl">{co.titulo} · {currentLevelObj.level}</h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <RouterLink to="/dashboard/cursos">
              {co.verCursos} <ArrowRight className="w-4 h-4" />
            </RouterLink>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="p-4 rounded-2xl bg-gradient-warm border border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{co.nivelAtual}</div>
            <div className="font-display text-2xl mb-2">{currentLevelObj.level} · {currentPct}%</div>
            <Progress value={currentPct} className="h-1.5" />
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{co.capitulosConcluidos}</div>
            <div className="font-display text-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              {globalStats.completedChapters}/{globalStats.totalChapters}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{co.mediaQuizzes}</div>
            <div className="font-display text-2xl flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {globalAvgQuiz}%
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{co.streak}</div>
            <div className="font-display text-2xl flex items-center gap-2">
              <Flame className="w-5 h-5 text-secondary" />
              {streak} <span className="text-sm text-muted-foreground font-normal">{co.sequencia}</span>
            </div>
          </div>
        </div>

        {recommended && (
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-spain text-primary-foreground">
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider opacity-90 mb-0.5">{co.proxRecomendado}</div>
              <div className="font-display text-lg truncate">
                {recommended.level} · {pickL(recommended.title, recommended.titleEn, locale)}
              </div>
            </div>
            <Button asChild variant="secondary" size="sm" className="font-bold shrink-0">
              <RouterLink to={`/cursos/${recommended.level}/capitulo/${recommended.chapterId}`}>
                {co.irCapitulo} <ArrowRight className="w-4 h-4" />
              </RouterLink>
            </Button>
          </div>
        )}
      </motion.section>

      {/* Jogos (destaque) + acesso aos cursos */}
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-spain rounded-3xl p-6 md:p-7 text-primary-foreground shadow-elevated"
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-secondary/30 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/15 backdrop-blur text-xs font-bold mb-3">
              <Gamepad2 className="w-3.5 h-3.5" /> {td.cardJogos.badge}
            </div>
            <h2 className="font-display text-2xl mb-2">{td.cardJogos.titulo}</h2>
            <p className="text-primary-foreground/90 text-sm mb-5">{td.cardJogos.descricao}</p>
            <Button asChild variant="secondary" size="lg" className="w-full font-bold">
              <Link to="/dashboard/jogos">
                {td.cardJogos.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <div className="flex gap-1.5 mt-4 flex-wrap">
              {GAME_CATEGORIES.slice(0, 6).map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.id}
                    className="w-9 h-9 rounded-lg bg-primary-foreground/15 backdrop-blur border border-primary-foreground/20 flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card hover:shadow-elevated transition-all flex flex-col"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-3 w-fit">
            <GraduationCap className="w-3.5 h-3.5" /> {co.eyebrow}
          </div>
          <h2 className="font-display text-2xl mb-2">{currentLevelObj.level} → {COURSE[COURSE.length - 1].level}</h2>
          <p className="text-muted-foreground text-sm mb-5">
            {globalStats.passedLevels}/{COURSE.length} · {globalStats.completedChapters}/{globalStats.totalChapters} {co.capitulosConcluidos.toLowerCase()}
          </p>
          <Button asChild variant="spain" size="lg" className="w-full font-bold mt-auto">
            <Link to="/dashboard/cursos">
              {co.verCursos} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Missões + Ranking */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card"
        >
          <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
                <Zap className="w-4 h-4" /> {td.missoes.eyebrow}
              </div>
              <h2 className="font-display text-2xl">{td.missoes.tituloFmt(missionsDone, missionsStatus.length)}</h2>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-secondary/30 border border-secondary/40 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {td.missoes.reiniciaEm(resetIn)}
            </div>
          </div>

          <div className="space-y-3">
            {missionsStatus.map((m, i) => {
              const Icon = MISSION_ICONS[m.id];
              const pct = m.done ? 100 : Math.round((m.progress / m.total) * 100);
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className={`group relative rounded-2xl p-4 border transition-all ${
                    m.done ? "bg-success/10 border-success/30" : "bg-gradient-warm border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                        m.done ? "bg-success/20 text-success" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {m.done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <h3 className={`font-semibold text-sm md:text-base ${m.done ? "line-through text-muted-foreground" : ""}`}>
                          {m.title}
                        </h3>
                        <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/40 text-xs font-bold">
                          <Sparkles className="w-3 h-3" /> +{m.reward}
                        </div>
                      </div>
                      {!m.done && (
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground font-semibold tabular-nums">
                            {m.progress}/{m.total}
                          </span>
                        </div>
                      )}
                      {m.done && <p className="text-xs text-success font-semibold">{td.missoes.reclamada}</p>}
                    </div>
                  </div>
                </motion.div>

              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card"
        >
          <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
                <Trophy className="w-4 h-4" /> {td.ranking.eyebrow}
              </div>
              <h2 className="font-display text-2xl">{td.ranking.titulo}</h2>
            </div>
          </div>

          <div className="space-y-1.5">
            {ranking.map((r, i) => {
              const RankIcon = r.pos <= 3 ? rankIcons[r.pos - 1] : null;
              const isGap = i > 0 && r.pos - ranking[i - 1].pos > 1;
              return (
                <div key={r.pos}>
                  {isGap && (
                    <div className="text-center text-xs text-muted-foreground py-1 font-bold tracking-widest">···</div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                      r.you ? "bg-gradient-spain text-primary-foreground shadow-card" : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                        r.you ? "bg-primary-foreground/20" : RankIcon ? "bg-secondary/40" : "bg-muted"
                      }`}
                    >
                      {RankIcon ? <RankIcon className="w-4 h-4 text-primary" /> : r.pos}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm truncate ${r.you ? "" : "text-foreground"}`}>{r.name}</div>
                    </div>
                    <div className={`text-sm font-bold tabular-nums ${r.you ? "" : "text-primary"}`}>
                      {r.xp.toLocaleString("es-ES")} XP
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <Button variant="ghost" size="sm" className="w-full mt-4 text-primary">
            {td.ranking.verCompleto} <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.section>
      </div>

      {/* Conquistas */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl p-6 md:p-7 border border-border shadow-card"
      >
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
              <Award className="w-4 h-4" /> {td.conquistas.eyebrow}
            </div>
            <h2 className="font-display text-2xl">
              {td.conquistas.tituloFmt(unlockedCount, achievements.length)}
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            {td.conquistas.verTodas} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all cursor-default ${
                a.unlocked
                  ? "bg-gradient-warm border-secondary/40 hover:border-primary/50 hover:-translate-y-0.5 shadow-sm"
                  : "bg-muted/40 border-border opacity-60"
              }`}
              title={`${a.name} — ${a.desc}`}
            >
              <div className={`text-2xl md:text-3xl mb-1 ${a.unlocked ? "" : "grayscale"}`}>
                {a.unlocked ? a.icon : <Lock className="w-5 h-5 text-muted-foreground mx-auto" />}
              </div>
              <div className="text-[10px] md:text-xs font-bold text-center leading-tight line-clamp-2">{a.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Faixa final motivacional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="relative overflow-hidden bg-gradient-warm rounded-3xl p-6 md:p-8 border border-secondary/40 flex items-center gap-4 md:gap-6"
      >
        <div className="flex-1">
          <h3 className="font-display text-xl md:text-2xl mb-1">{td.motivacao.titulo}</h3>
          <p className="text-sm text-muted-foreground">{td.motivacao.subtitulo}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
