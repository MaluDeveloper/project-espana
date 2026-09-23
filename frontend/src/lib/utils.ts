import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** A given date as YYYY-MM-DD in the viewer's local timezone (not UTC — streaks/missions roll over at local midnight). */
export function localIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's date as YYYY-MM-DD in the viewer's local timezone. */
export function todayIso(): string {
  return localIso(new Date());
}

/** Lowercases, trims and strips accents — for tolerant free-text answer comparison (e.g. "esta"/"está"). */
export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
