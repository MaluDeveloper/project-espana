// User preferences stored in localStorage.
// All getters are SSR-safe and return defaults outside the browser.

export type ReminderTime = "morning" | "afternoon" | "evening";
export type DailyGoalMinutes = 10 | 20 | 30 | 60;
export type Difficulty = "auto" | "easy" | "hard";
export type FontSize = "normal" | "large";

const K = {
  notif: "spanish-ai-pref-notifications",
  reminder: "spanish-ai-pref-reminder-time",
  sound: "spanish-ai-pref-sounds",
  dailyGoal: "spanish-ai-pref-daily-goal",
  difficulty: "spanish-ai-pref-difficulty",
  showTranslation: "spanish-ai-pref-show-translation",
  fontSize: "spanish-ai-pref-font-size",
} as const;

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getNotifications = () => read<boolean>(K.notif, true);
export const setNotifications = (v: boolean) => write(K.notif, v);

export const getReminderTime = () => read<ReminderTime>(K.reminder, "evening");
export const setReminderTime = (v: ReminderTime) => write(K.reminder, v);

export const getSounds = () => read<boolean>(K.sound, true);
export const setSounds = (v: boolean) => write(K.sound, v);

export const getDailyGoal = () => read<DailyGoalMinutes>(K.dailyGoal, 20);
export const setDailyGoal = (v: DailyGoalMinutes) => write(K.dailyGoal, v);

export const getDifficulty = () => read<Difficulty>(K.difficulty, "auto");
export const setDifficulty = (v: Difficulty) => write(K.difficulty, v);

export const getShowTranslation = () => read<boolean>(K.showTranslation, true);
export const setShowTranslation = (v: boolean) => write(K.showTranslation, v);

export const getFontSize = () => read<FontSize>(K.fontSize, "normal");
export const setFontSize = (v: FontSize) => {
  write(K.fontSize, v);
  applyFontSize(v);
};

export const applyFontSize = (v: FontSize = getFontSize()) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("text-size-large", v === "large");
};
