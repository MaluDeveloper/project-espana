// Estatísticas dinâmicas para o Dashboard.
// Conecta course-progress.ts (cursos/quizzes/streak/studyDays) e progress.ts (jogos)
// e adiciona pequenos rastreadores no localStorage (flashcards diários, missões reclamadas, bônus XP).

import { COURSE } from "@/data/courses";
import {
  loadCourse,
  getLevelCompletionPercent,
  getChapterCompletionPercent,
  isChapterFullyComplete,
  getStreak,
} from "./course-progress";
import { loadProgress } from "./progress";
import { GAME_CATEGORIES, type LevelId } from "@/data/games";
import { todayIso, localIso } from "./utils";

// ---------------------------------------------------------
// Helpers de data
// ---------------------------------------------------------

const isSameDay = (ts: number, isoDay: string) => localIso(new Date(ts)) === isoDay;

// ---------------------------------------------------------
// Flashcards (rastreador próprio)
// ---------------------------------------------------------
const FC_KEY = "spanish-ai-flashcards-v1";

interface FlashcardState {
  total: number;
  dayIso: string;
  today: number;
}

const readFc = (): FlashcardState => {
  if (typeof window === "undefined") return { total: 0, dayIso: todayIso(), today: 0 };
  try {
    const raw = localStorage.getItem(FC_KEY);
    if (!raw) return { total: 0, dayIso: todayIso(), today: 0 };
    const parsed = JSON.parse(raw) as FlashcardState;
    if (parsed.dayIso !== todayIso()) {
      return { total: parsed.total ?? 0, dayIso: todayIso(), today: 0 };
    }
    return parsed;
  } catch {
    return { total: 0, dayIso: todayIso(), today: 0 };
  }
};

export const registerFlashcardSeen = () => {
  if (typeof window === "undefined") return;
  const s = readFc();
  s.total += 1;
  s.today += 1;
  localStorage.setItem(FC_KEY, JSON.stringify(s));
};

export const getFlashcardsToday = () => readFc().today;
export const getFlashcardsTotal = () => readFc().total;

// ---------------------------------------------------------
// Jogos: partidas jogadas hoje + vitórias na memória
// ---------------------------------------------------------
export const getGamesPlayedToday = (): number => {
  const state = loadProgress();
  const day = todayIso();
  let count = 0;
  for (const cat of Object.values(state)) {
    for (const lvl of Object.values(cat ?? {})) {
      for (const r of Object.values(lvl ?? {})) {
        if (r?.completedAt && isSameDay(r.completedAt, day)) count += 1;
      }
    }
  }
  return count;
};

export const getMemoryWins = (): number => {
  const state = loadProgress();
  const memCat = state["memoria" as keyof typeof state];
  if (!memCat) return 0;
  let wins = 0;
  for (const lvl of Object.values(memCat)) {
    for (const r of Object.values(lvl ?? {})) {
      if (r) wins += 1;
    }
  }
  return wins;
};

// ---------------------------------------------------------
// Cursos: completos hoje, totais, médias, histórico de quizzes
// ---------------------------------------------------------
export interface QuizHistoryItem {
  level: LevelId;
  chapterId: string;
  chapterTitle: string;
  chapterTitleEn?: string;
  score: number;
  total: number;
  takenAt: number;
}

export const getQuizHistory = (limit = 10): QuizHistoryItem[] => {
  const state = loadCourse();
  const items: QuizHistoryItem[] = [];
  for (const course of COURSE) {
    const lvl = state.levels[course.level];
    if (!lvl?.chapterQuizzes) continue;
    for (const [chapterId, quiz] of Object.entries(lvl.chapterQuizzes)) {
      const chapter = course.chapters.find((c) => c.id === chapterId);
      if (!chapter) continue;
      items.push({
        level: course.level,
        chapterId,
        chapterTitle: chapter.title,
        chapterTitleEn: chapter.titleEn,
        score: quiz.score,
        total: quiz.total,
        takenAt: quiz.takenAt,
      });
    }
  }
  items.sort((a, b) => b.takenAt - a.takenAt);
  return items.slice(0, limit);
};

export const getCompletedChaptersToday = (): number => {
  const state = loadCourse();
  const day = todayIso();
  let count = 0;
  for (const course of COURSE) {
    const lvl = state.levels[course.level];
    if (!lvl?.chapterQuizzes) continue;
    for (const chapter of course.chapters) {
      const q = lvl.chapterQuizzes[chapter.id];
      if (q && isSameDay(q.takenAt, day) && isChapterFullyComplete(course.level, chapter.id)) {
        count += 1;
      }
    }
  }
  return count;
};

export const getCompletedChaptersTotal = (): number => {
  let count = 0;
  for (const course of COURSE) {
    for (const chapter of course.chapters) {
      if (getChapterCompletionPercent(course.level, chapter.id) === 100) count += 1;
    }
  }
  return count;
};

export const getOverallCompletionPercent = (): number => {
  const sum = COURSE.reduce((s, c) => s + getLevelCompletionPercent(c.level), 0);
  return Math.round(sum / COURSE.length);
};

export const getOverallAvgQuiz = (): number => {
  const state = loadCourse();
  const all: number[] = [];
  for (const course of COURSE) {
    const quizzes = Object.values(state.levels[course.level]?.chapterQuizzes ?? {});
    for (const q of quizzes) all.push((q.score / q.total) * 100);
  }
  if (!all.length) return 0;
  return Math.round(all.reduce((s, n) => s + n, 0) / all.length);
};

export const getTotalQuizzesTaken = (): number => {
  const state = loadCourse();
  let count = 0;
  for (const course of COURSE) {
    count += Object.keys(state.levels[course.level]?.chapterQuizzes ?? {}).length;
  }
  return count;
};

// ---------------------------------------------------------
// Tempo de estudo real (heartbeat por segundos, não mais estimativa fixa)
// ---------------------------------------------------------
const STUDY_TIME_KEY = "spanish-ai-study-time-v1";
const HEARTBEAT_SECONDS = 30;
export const STUDY_HEARTBEAT_MS = HEARTBEAT_SECONDS * 1000;

interface StudyTimeState {
  bySeconds: Record<string, number>; // dayIso -> segundos estudados naquele dia
}

const readStudyTime = (): StudyTimeState => {
  if (typeof window === "undefined") return { bySeconds: {} };
  try {
    const raw = localStorage.getItem(STUDY_TIME_KEY);
    if (!raw) return { bySeconds: {} };
    const parsed = JSON.parse(raw) as StudyTimeState;
    return { bySeconds: parsed.bySeconds ?? {} };
  } catch {
    return { bySeconds: {} };
  }
};

const writeStudyTime = (s: StudyTimeState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STUDY_TIME_KEY, JSON.stringify(s));
};

/** Chamado a cada heartbeat enquanto uma página de estudo está aberta e visível na tela. */
export const registerStudyHeartbeat = (seconds: number = HEARTBEAT_SECONDS) => {
  if (typeof window === "undefined") return;
  const day = todayIso();
  const s = readStudyTime();
  s.bySeconds[day] = (s.bySeconds[day] ?? 0) + seconds;
  writeStudyTime(s);
};

// ---------------------------------------------------------
// Atividade da semana (últimos 7 dias)
// ---------------------------------------------------------
const WEEK_LABELS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export interface WeekActivityItem {
  dayIso: string;
  label: string;
  studied: boolean;
  minutes: number;
}

export const getWeekActivity = (): WeekActivityItem[] => {
  const bySeconds = readStudyTime().bySeconds;
  const out: WeekActivityItem[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const minutes = Math.round((bySeconds[iso] ?? 0) / 60);
    out.push({
      dayIso: iso,
      label: WEEK_LABELS_PT[d.getDay()],
      studied: minutes > 0,
      minutes,
    });
  }
  return out;
};

export const getTotalStudyMinutes = (): number => {
  const bySeconds = readStudyTime().bySeconds;
  const totalSeconds = Object.values(bySeconds).reduce((s, n) => s + n, 0);
  return Math.round(totalSeconds / 60);
};

export const formatStudyTime = (minutes: number): string => {
  if (minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
};

// ---------------------------------------------------------
// Missões diárias (dinâmicas)
// ---------------------------------------------------------
export interface MissionStatus {
  id: "capitulo" | "partidas" | "palavras";
  title: string;
  progress: number;
  total: number;
  done: boolean;
  reward: number;
}

export const getMissionsStatus = (): MissionStatus[] => {
  const chapters = getCompletedChaptersToday();
  const games = getGamesPlayedToday();
  const words = getFlashcardsToday();
  return [
    {
      id: "capitulo",
      title: "Complete 1 capítulo hoje",
      progress: Math.min(chapters, 1),
      total: 1,
      done: chapters >= 1,
      reward: 50,
    },
    {
      id: "partidas",
      title: "Jogue 3 partidas hoje",
      progress: Math.min(games, 3),
      total: 3,
      done: games >= 3,
      reward: 30,
    },
    {
      id: "palavras",
      title: "Aprenda 10 palavras hoje",
      progress: Math.min(words, 10),
      total: 10,
      done: words >= 10,
      reward: 40,
    },
  ];
};

// Reset à meia-noite — countdown em string "Xh Ym"
export const getMidnightCountdown = (): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  const diffMs = tomorrow.getTime() - now.getTime();
  const totalMin = Math.max(0, Math.floor(diffMs / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
};

// ---------------------------------------------------------
// Bônus XP por missões (auto-claim quando concluídas)
// ---------------------------------------------------------
const BONUS_KEY = "spanish-ai-mission-bonus-v1";

interface BonusState {
  totalXp: number;
  claimedByDay: Record<string, string[]>; // dayIso -> missionIds reclamados
}

const readBonus = (): BonusState => {
  if (typeof window === "undefined") return { totalXp: 0, claimedByDay: {} };
  try {
    const raw = localStorage.getItem(BONUS_KEY);
    if (!raw) return { totalXp: 0, claimedByDay: {} };
    const parsed = JSON.parse(raw) as BonusState;
    return { totalXp: parsed.totalXp ?? 0, claimedByDay: parsed.claimedByDay ?? {} };
  } catch {
    return { totalXp: 0, claimedByDay: {} };
  }
};

const writeBonus = (s: BonusState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(BONUS_KEY, JSON.stringify(s));
};

/** Verifica missões concluídas e adiciona bônus de XP ainda não reclamados hoje. Retorna XP adicionado nesta chamada. */
export const claimMissionRewards = (): number => {
  if (typeof window === "undefined") return 0;
  const day = todayIso();
  const s = readBonus();
  const claimed = new Set(s.claimedByDay[day] ?? []);
  let added = 0;
  for (const m of getMissionsStatus()) {
    if (m.done && !claimed.has(m.id)) {
      added += m.reward;
      claimed.add(m.id);
    }
  }
  if (added > 0) {
    s.totalXp += added;
    s.claimedByDay[day] = Array.from(claimed);
    writeBonus(s);
  }
  return added;
};

export const getBonusXp = (): number => readBonus().totalXp;

// ---------------------------------------------------------
// XP total (jogos + bônus de missões)
// ---------------------------------------------------------
export const getTotalXp = (): number => {
  let xp = 0;
  for (const cat of GAME_CATEGORIES) {
    if (!cat.available) continue;
    const catState = loadProgress()[cat.id] ?? {};
    for (const lvl of Object.values(catState)) {
      for (const r of Object.values(lvl ?? {})) {
        if (r) xp += r.xp;
      }
    }
  }
  return xp + getBonusXp();
};

// ---------------------------------------------------------
// Conquistas
// ---------------------------------------------------------
export interface AchievementStatus {
  id:
    | "primerPaso"
    | "racha"
    | "memoria"
    | "poliglota"
    | "conversador"
    | "maestro"
    | "imparable"
    | "fluente";
  unlocked: boolean;
  progress: number;
  total: number;
}

export const getAchievementsStatus = (): AchievementStatus[] => {
  const streak = getStreak();
  const firstChapter = COURSE.some((c) =>
    c.chapters.some((ch) => isChapterFullyComplete(c.level, ch.id)),
  );
  const memoryWins = getMemoryWins();
  const totalFlash = getFlashcardsTotal();
  const quizzesTaken = getTotalQuizzesTaken();
  const levelsAtLeast80 = COURSE.filter((c) => getLevelCompletionPercent(c.level) >= 80).length;
  const allLevelsDone = levelsAtLeast80 >= COURSE.length;

  return [
    { id: "primerPaso", unlocked: firstChapter, progress: firstChapter ? 1 : 0, total: 1 },
    { id: "racha", unlocked: streak >= 7, progress: Math.min(streak, 7), total: 7 },
    { id: "memoria", unlocked: memoryWins >= 10, progress: Math.min(memoryWins, 10), total: 10 },
    { id: "poliglota", unlocked: totalFlash >= 100, progress: Math.min(totalFlash, 100), total: 100 },
    { id: "conversador", unlocked: quizzesTaken >= 5, progress: Math.min(quizzesTaken, 5), total: 5 },
    { id: "maestro", unlocked: levelsAtLeast80 >= 1, progress: Math.min(levelsAtLeast80, 1), total: 1 },
    { id: "imparable", unlocked: streak >= 30, progress: Math.min(streak, 30), total: 30 },
    { id: "fluente", unlocked: allLevelsDone, progress: levelsAtLeast80, total: COURSE.length },
  ];
};
