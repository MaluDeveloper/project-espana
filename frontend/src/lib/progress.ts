// Persistência leve de progresso de jogos no localStorage.
import type { GameCategoryId, LevelId } from "@/data/games";

const KEY = "spanish-ai-progress-v1";

export interface StageResult {
  stars: 1 | 2 | 3;
  xp: number;
  completedAt: number;
}

export type ProgressState = Partial<
  Record<GameCategoryId, Partial<Record<LevelId, Record<number, StageResult>>>>
>;

const safeParse = (raw: string | null): ProgressState => {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ProgressState;
  } catch {
    return {};
  }
};

export const loadProgress = (): ProgressState => {
  if (typeof window === "undefined") return {};
  return safeParse(localStorage.getItem(KEY));
};

export const saveStage = (
  cat: GameCategoryId,
  level: LevelId,
  stage: number,
  result: StageResult,
) => {
  const state = loadProgress();
  const catState = state[cat] ?? {};
  const levelState = catState[level] ?? {};
  const previous = levelState[stage];
  // Mantém as melhores estrelas/XP, mas sempre atualiza completedAt para a tentativa
  // atual — senão repetir uma fase empatando o recorde não conta pra missão diária.
  const best: StageResult =
    previous && previous.stars > result.stars
      ? { ...previous, completedAt: result.completedAt }
      : result;
  levelState[stage] = best;
  catState[level] = levelState;
  state[cat] = catState;
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const getStageResult = (
  cat: GameCategoryId,
  level: LevelId,
  stage: number,
): StageResult | undefined => {
  return loadProgress()[cat]?.[level]?.[stage];
};

export const isStageUnlocked = (
  cat: GameCategoryId,
  level: LevelId,
  stage: number,
): boolean => {
  if (stage === 1) return true;
  return Boolean(getStageResult(cat, level, stage - 1));
};

export const getLevelStats = (cat: GameCategoryId, level: LevelId) => {
  const stages = loadProgress()[cat]?.[level] ?? {};
  const completed = Object.keys(stages).length;
  const stars = Object.values(stages).reduce((sum, s) => sum + s.stars, 0);
  const xp = Object.values(stages).reduce((sum, s) => sum + s.xp, 0);
  return { completed, stars, xp };
};

export const getCategoryStats = (cat: GameCategoryId) => {
  const cats = loadProgress()[cat] ?? {};
  let completed = 0;
  let stars = 0;
  let xp = 0;
  for (const lvl of Object.values(cats)) {
    for (const r of Object.values(lvl ?? {})) {
      completed += 1;
      stars += r.stars;
      xp += r.xp;
    }
  }
  return { completed, stars, xp };
};
