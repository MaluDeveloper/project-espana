// Helpers para gerar fases determinísticas a partir de um seed (catId+level+stage).
// Garante que cada fase tenha conteúdo estável e diferente das outras.

import {
  GAP_BANK,
  poolsByLevel,
  VOCAB_POOLS,
  type GapSentence,
  type LevelId,
  type ThemePool,
  type VocabPair,
} from "@/data/games";

// PRNG mulberry32 para resultados determinísticos.
const seedFromString = (s: string): number => {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffle = <T,>(arr: T[], rand: () => number): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const makeRandom = (seed: string) => mulberry32(seedFromString(seed));

// ─────────────────────────────────────────────────────────────
// MEMORY: 6 a 8 pares por fase.
// ─────────────────────────────────────────────────────────────
export interface MemoryStage {
  theme: string;
  themeEn: string;
  level: LevelId;
  pairs: VocabPair[];
}

const fallbackPool = (level: LevelId): ThemePool[] => {
  const pools = poolsByLevel(level);
  return pools.length ? pools : VOCAB_POOLS;
};

export const buildMemoryStage = (level: LevelId, stage: number): MemoryStage => {
  const rand = makeRandom(`memoria-${level}-${stage}`);
  const pools = fallbackPool(level);
  const pool = pools[Math.floor(rand() * pools.length)];
  const size = level === "A1" ? 6 : level === "A2" ? 6 : level === "B1" ? 7 : 8;
  const pairs = shuffle(pool.words, rand).slice(0, size);
  return { theme: pool.theme, themeEn: pool.themeEn ?? pool.theme, level, pairs };
};

// ─────────────────────────────────────────────────────────────
// WORDSEARCH: grid quadrado com palavras embutidas.
// ─────────────────────────────────────────────────────────────
export interface WordSearchStage {
  theme: string;
  themeEn: string;
  level: LevelId;
  size: number;
  grid: string[][];
  words: { word: string; pt: string; en: string; cells: [number, number][] }[];
}

const DIRS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
];

const tryPlace = (
  grid: string[][],
  word: string,
  rand: () => number,
): [number, number][] | null => {
  const size = grid.length;
  for (let attempt = 0; attempt < 80; attempt++) {
    const dir = DIRS[Math.floor(rand() * DIRS.length)];
    const r0 = Math.floor(rand() * size);
    const c0 = Math.floor(rand() * size);
    const cells: [number, number][] = [];
    let ok = true;
    for (let i = 0; i < word.length; i++) {
      const r = r0 + dir[0] * i;
      const c = c0 + dir[1] * i;
      if (r < 0 || c < 0 || r >= size || c >= size) {
        ok = false;
        break;
      }
      const ch = grid[r][c];
      if (ch && ch !== word[i]) {
        ok = false;
        break;
      }
      cells.push([r, c]);
    }
    if (ok) {
      cells.forEach(([r, c], i) => {
        grid[r][c] = word[i];
      });
      return cells;
    }
  }
  return null;
};

const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-ZÑ]/g, "");

export const buildWordSearchStage = (level: LevelId, stage: number): WordSearchStage => {
  const rand = makeRandom(`caza-${level}-${stage}`);
  const pools = fallbackPool(level);
  const pool = pools[Math.floor(rand() * pools.length)];
  const wordCount = level === "A1" ? 5 : level === "A2" ? 6 : 7;
  const size = level === "A1" ? 9 : level === "A2" ? 10 : 11;
  const candidates = shuffle(pool.words, rand)
    .map((w) => ({ ...w, normalized: normalize(w.es) }))
    .filter((w) => w.normalized.length <= size)
    .slice(0, wordCount);

  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placed: WordSearchStage["words"] = [];
  for (const w of candidates) {
    const cells = tryPlace(grid, w.normalized, rand);
    if (cells) placed.push({ word: w.normalized, pt: w.pt, en: w.en, cells });
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = ALPHABET[Math.floor(rand() * ALPHABET.length)];
    }
  }
  return { theme: pool.theme, themeEn: pool.themeEn ?? pool.theme, level, size, grid, words: placed };
};

// ─────────────────────────────────────────────────────────────
// GAPS: 5 frases por fase.
// ─────────────────────────────────────────────────────────────
export interface GapsStage {
  level: LevelId;
  sentences: GapSentence[];
}

export const buildGapsStage = (level: LevelId, stage: number): GapsStage => {
  const rand = makeRandom(`lacunas-${level}-${stage}`);
  const bank = GAP_BANK[level] ?? GAP_BANK.A1;
  const count = Math.min(5, bank.length);
  const sentences = shuffle(bank, rand).slice(0, count);
  return { level, sentences };
};

// ─────────────────────────────────────────────────────────────
// XP / Estrelas
// ─────────────────────────────────────────────────────────────
export const computeStars = (correctRatio: number): 1 | 2 | 3 => {
  if (correctRatio >= 0.95) return 3;
  if (correctRatio >= 0.7) return 2;
  return 1;
};

export const computeXp = (stars: 1 | 2 | 3, level: LevelId): number => {
  const base: Record<LevelId, number> = { A1: 30, A2: 40, B1: 60, B2: 80, C1: 100, C2: 120 };
  return base[level] * stars;
};
