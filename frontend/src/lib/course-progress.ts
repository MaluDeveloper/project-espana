// Persistência de progresso do curso (livro online + provas + quizzes + streak) no localStorage.
import type { LevelId } from "@/data/games";
import { COURSE, PASS_THRESHOLD } from "@/data/courses";

const KEY = "spanish-ai-course-v1";

export interface ChapterProgress {
  topicsRead: string[];
  exercisesCorrect: string[];
  completedAt?: number;
}

export interface ExamResult {
  score: number;
  total: number;
  passed: boolean;
  takenAt: number;
}

export interface ChapterQuizResult {
  score: number;
  total: number;
  takenAt: number;
}

export interface CourseState {
  levels: Partial<Record<LevelId, {
    chapters: Record<string, ChapterProgress>;
    chapterQuizzes?: Record<string, ChapterQuizResult>;
    exam?: ExamResult;
  }>>;
  studyDays?: string[];
}

const safeParse = (raw: string | null): CourseState => {
  if (!raw) return { levels: {}, studyDays: [] };
  try {
    const parsed = JSON.parse(raw) as CourseState;
    return { levels: parsed.levels ?? {}, studyDays: parsed.studyDays ?? [] };
  } catch {
    return { levels: {}, studyDays: [] };
  }
};

export const loadCourse = (): CourseState => {
  if (typeof window === "undefined") return { levels: {}, studyDays: [] };
  return safeParse(localStorage.getItem(KEY));
};

const persist = (s: CourseState) => localStorage.setItem(KEY, JSON.stringify(s));

const ensure = (s: CourseState, level: LevelId) => {
  s.levels[level] = s.levels[level] ?? { chapters: {}, chapterQuizzes: {} };
  s.levels[level]!.chapterQuizzes = s.levels[level]!.chapterQuizzes ?? {};
  return s.levels[level]!;
};

const ensureChapter = (s: CourseState, level: LevelId, chapterId: string) => {
  const lvl = ensure(s, level);
  lvl.chapters[chapterId] = lvl.chapters[chapterId] ?? { topicsRead: [], exercisesCorrect: [] };
  return lvl.chapters[chapterId];
};

export const markTopicRead = (level: LevelId, chapterId: string, topicId: string) => {
  const s = loadCourse();
  const ch = ensureChapter(s, level, chapterId);
  if (!ch.topicsRead.includes(topicId)) ch.topicsRead.push(topicId);
  persist(s);
};

export const markExerciseCorrect = (level: LevelId, chapterId: string, exerciseId: string) => {
  const s = loadCourse();
  const ch = ensureChapter(s, level, chapterId);
  if (!ch.exercisesCorrect.includes(exerciseId)) ch.exercisesCorrect.push(exerciseId);
  persist(s);
};

export const saveExam = (level: LevelId, score: number, total: number): ExamResult => {
  const s = loadCourse();
  const lvl = ensure(s, level);
  const passed = score / total >= PASS_THRESHOLD;
  const result: ExamResult = { score, total, passed, takenAt: Date.now() };
  if (!lvl.exam || lvl.exam.score < score) lvl.exam = result;
  persist(s);
  return result;
};

export const saveChapterQuiz = (level: LevelId, chapterId: string, score: number, total: number): ChapterQuizResult => {
  const s = loadCourse();
  const lvl = ensure(s, level);
  const result: ChapterQuizResult = { score, total, takenAt: Date.now() };
  const prev = lvl.chapterQuizzes![chapterId];
  if (!prev || prev.score < score) lvl.chapterQuizzes![chapterId] = result;
  persist(s);
  return result;
};

export const getChapterQuiz = (level: LevelId, chapterId: string): ChapterQuizResult | undefined => {
  return loadCourse().levels[level]?.chapterQuizzes?.[chapterId];
};

export const getChapterProgress = (level: LevelId, chapterId: string): ChapterProgress => {
  return loadCourse().levels[level]?.chapters[chapterId] ?? { topicsRead: [], exercisesCorrect: [] };
};

export const getExam = (level: LevelId): ExamResult | undefined => {
  return loadCourse().levels[level]?.exam;
};

export const isLevelPassed = (level: LevelId): boolean => {
  return Boolean(getExam(level)?.passed);
};

// % de conclusão de um capítulo: 50% leitura + 30% exercícios + 20% quiz aprovado.
export const getChapterCompletionPercent = (level: LevelId, chapterId: string): number => {
  const course = COURSE.find((c) => c.level === level);
  const chapter = course?.chapters.find((c) => c.id === chapterId);
  if (!chapter) return 0;
  const prog = getChapterProgress(level, chapterId);
  const totalTopics = Math.max(chapter.topics.length, 1);
  const totalEx = Math.max(chapter.topics.reduce((s, t) => s + t.exercises.length, 0), 1);
  const readPct = (prog.topicsRead.length / totalTopics) * 50;
  const exPct = (prog.exercisesCorrect.length / totalEx) * 30;
  const quiz = getChapterQuiz(level, chapterId);
  const quizPct = quiz && quiz.score / quiz.total >= 0.7 ? 20 : 0;
  return Math.min(100, Math.round(readPct + exPct + quizPct));
};

// Threshold (%) que o aluno precisa no item anterior para destravar o próximo.
export const UNLOCK_THRESHOLD = 80;

export const isChapterCompleted = (level: LevelId, chapterId: string): boolean => {
  return getChapterCompletionPercent(level, chapterId) >= UNLOCK_THRESHOLD;
};

export const isChapterFullyComplete = (level: LevelId, chapterId: string): boolean => {
  return getChapterCompletionPercent(level, chapterId) >= 100;
};

// Desbloqueio sequencial de capítulos.
export const isChapterUnlocked = (level: LevelId, chapterId: string): boolean => {
  const course = COURSE.find((c) => c.level === level);
  if (!course) return false;
  const idx = course.chapters.findIndex((c) => c.id === chapterId);
  if (idx <= 0) return true;
  const prev = course.chapters[idx - 1];
  return getChapterCompletionPercent(level, prev.id) >= UNLOCK_THRESHOLD;
};

// Desbloqueio de níveis: A1 sempre liberado; demais precisam do nível anterior >= UNLOCK_THRESHOLD%.
export const isLevelUnlocked = (level: LevelId): boolean => {
  const idx = COURSE.findIndex((c) => c.level === level);
  if (idx <= 0) return true;
  const prev = COURSE[idx - 1];
  return getLevelCompletionPercent(prev.level) >= UNLOCK_THRESHOLD;
};

export const getPreviousLevel = (level: LevelId): LevelId | undefined => {
  const idx = COURSE.findIndex((c) => c.level === level);
  if (idx <= 0) return undefined;
  return COURSE[idx - 1].level;
};

// % geral de um nível: média de % dos capítulos + bônus 10% se prova aprovada.
export const getLevelCompletionPercent = (level: LevelId): number => {
  const course = COURSE.find((c) => c.level === level);
  if (!course) return 0;
  const avg = course.chapters.reduce((s, ch) => s + getChapterCompletionPercent(level, ch.id), 0) / course.chapters.length;
  const examBonus = isLevelPassed(level) ? 10 : 0;
  return Math.min(100, Math.round(avg * 0.9 + examBonus));
};

// Capítulo "atual" do nível (1-indexed): último com progresso > 0, ou 1 se nenhum começado.
export const getCurrentChapterNumber = (level: LevelId): number => {
  const course = COURSE.find((c) => c.level === level);
  if (!course) return 1;
  let last = -1;
  course.chapters.forEach((ch, i) => {
    if (getChapterCompletionPercent(level, ch.id) > 0) last = i;
  });
  return (last >= 0 ? last : 0) + 1;
};

export const getLevelStats = (level: LevelId) => {
  const course = COURSE.find((c) => c.level === level);
  if (!course) return { chapters: 0, totalChapters: 0, exam: undefined as ExamResult | undefined, completedChapters: 0, avgQuizScore: 0 };
  const data = loadCourse().levels[level];
  const completedChapters = course.chapters.filter((c) => isChapterCompleted(level, c.id)).length;
  const quizzes = Object.values(data?.chapterQuizzes ?? {});
  const avgQuizScore = quizzes.length
    ? Math.round(quizzes.reduce((s, q) => s + (q.score / q.total) * 100, 0) / quizzes.length)
    : 0;
  return {
    chapters: Object.keys(data?.chapters ?? {}).length,
    totalChapters: course.chapters.length,
    exam: data?.exam,
    completedChapters,
    avgQuizScore,
  };
};

// Streak.
const todayIso = () => new Date().toISOString().slice(0, 10);

export const registerStudyToday = () => {
  if (typeof window === "undefined") return;
  const s = loadCourse();
  const today = todayIso();
  if (!s.studyDays!.includes(today)) {
    s.studyDays!.push(today);
    persist(s);
  }
};

export const getStreak = (): number => {
  const days = new Set(loadCourse().studyDays ?? []);
  let streak = 0;
  const cursor = new Date();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const iso = cursor.toISOString().slice(0, 10);
    if (days.has(iso)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const getRecommendedChapter = (): { level: LevelId; chapterId: string; title: string; titleEn?: string } | undefined => {
  for (const course of COURSE) {
    if (!isLevelUnlocked(course.level)) continue;
    for (const ch of course.chapters) {
      if (!isChapterCompleted(course.level, ch.id)) {
        return { level: course.level, chapterId: ch.id, title: ch.title, titleEn: ch.titleEn };
      }
    }
  }
  return undefined;
};
