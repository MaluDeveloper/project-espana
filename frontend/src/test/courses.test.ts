import { describe, it, expect } from "vitest";
import { COURSE } from "@/data/courses";
import type { Exercise } from "@/data/courses";

describe("COURSE data", () => {
  it("has the six levels with 13 chapters each", () => {
    expect(COURSE.map((c) => c.level)).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    for (const c of COURSE) expect(c.chapters).toHaveLength(13);
  });

  it("no level carries the unused static `exam` field", () => {
    for (const c of COURSE) expect(Object.keys(c)).not.toContain("exam");
  });
});

const A2_STANDARDIZED: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const A2_FINAL_CHAPTERS = new Set([12, 13]);
const A2 = COURSE.find((c) => c.level === "A2")!;
const ENGLISH = /(?<!\p{L})(the|and|you|your|with|this|which)(?!\p{L})/iu;

describe.each(A2_STANDARDIZED)("A2 chapter %i follows the reference standard", (n) => {
  const ch = A2.chapters.find((c) => c.number === n)!;
  const exercises = ch.topics.flatMap((t) => t.exercises);
  const all: Exercise[] = [...exercises, ...(ch.quiz ?? [])];

  it("has the expected topic count with 5–12 exercises each", () => {
    if (A2_FINAL_CHAPTERS.has(n)) {
      expect(ch.topics.length).toBeGreaterThanOrEqual(3);
      expect(ch.topics.length).toBeLessThanOrEqual(6);
    } else {
      expect(ch.topics).toHaveLength(3);
    }
    for (const t of ch.topics) expect(t.exercises.length).toBeGreaterThanOrEqual(5);
    for (const t of ch.topics) expect(t.exercises.length).toBeLessThanOrEqual(12);
  });

  it("has theory with paragraph and example in every topic", () => {
    for (const t of ch.topics) {
      if (n === 13) {
        expect(t.blocks.some((b) => b.kind === "paragraph" || b.kind === "tip"), t.id).toBe(true);
        continue;
      }
      expect(t.blocks.length).toBeGreaterThanOrEqual(4);
      expect(t.blocks.some((b) => b.kind === "paragraph")).toBe(true);
      expect(t.blocks.some((b) => b.kind === "example")).toBe(true);
    }
  });

  it("explains every exercise and quiz question", () => {
    for (const e of all) expect(e.explanation?.trim(), e.id).toBeTruthy();
  });

  it("has well-formed exercises", () => {
    for (const e of all) {
      if (e.type === "multiple-choice") {
        expect(e.options, e.id).toContain(e.answer);
        expect(new Set(e.options).size, e.id).toBe(e.options!.length);
      }
      if (e.type === "fill-blank") expect(e.question, e.id).toContain("___");
    }
  });

  it("has quiz 10, lexicon 8, 10 flashcards not repeating the lexicon, and a brief review", () => {
    expect(ch.quiz).toHaveLength(10);
    expect(ch.lexicon).toHaveLength(8);
    expect(ch.flashcards).toHaveLength(10);
    const lex = new Set(ch.lexicon.map((l) => l.es.toLowerCase()));
    for (const f of ch.flashcards!) expect(lex.has(f.es.toLowerCase()), f.es).toBe(false);
    expect(ch.briefReview?.trim()).toBeTruthy();
  });

  it("tells the learner when a blank needs two words", () => {
    for (const e of all) {
      if ((e.question.match(/___/g) ?? []).length >= 2) expect(e.question, e.id).toContain("duas palavras");
    }
  });

  it("has no line breaks in theory text", () => {
    for (const t of ch.topics) {
      for (const b of t.blocks) {
        for (const k of ["text", "es", "pt"] as const) {
          const v = (b as Record<string, unknown>)[k];
          if (typeof v === "string") expect(v.includes("\n"),`${t.id}: ${v}`).toBe(false);
        }
        if (b.kind === "list") for (const i of b.items) expect(i.includes("\n"), `${t.id}: ${i}`).toBe(false);
        if (b.kind === "table") {
          for (const c of [...b.headers, ...b.rows.flat()]) expect(c.includes("\n"), `${t.id}: ${c}`).toBe(false);
        }
      }
    }
  });

  it("has no English in learner-facing Portuguese text", () => {
    const texts = [
      ...all.map((e) => e.explanation ?? ""),
      ...all.flatMap((e) => [e.question, ...(e.options ?? [])]),
      ...ch.topics.flatMap((t) =>
        t.blocks.flatMap((b) =>
          "text" in b ? [b.text] : "pt" in b ? [b.pt] : b.kind === "list" ? b.items : b.kind === "table" ? [...b.headers, ...b.rows.flat()] : [],
        ),
      ),
      ...[...ch.lexicon, ...(ch.flashcards ?? [])].map((l) => l.pt),
      ch.briefReview ?? "",
    ];
    for (const s of texts) expect(s, s).not.toMatch(ENGLISH);
  });
});

it("A2 exercise and quiz ids are unique across the level", () => {
  const ids = A2.chapters.flatMap((c) => [...c.topics.flatMap((t) => t.exercises), ...(c.quiz ?? [])].map((e) => e.id));
  expect(new Set(ids).size).toBe(ids.length);
});

it("A2 topic ids are unique across the level", () => {
  const ids = A2.chapters.flatMap((c) => c.topics.map((t) => t.id));
  expect(new Set(ids).size).toBe(ids.length);
});

const EXPLAINED_CHAPTERS: Record<string, number[]> = { B1: [1, 2, 3, 4, 5, 6, 7], B2: [] };

describe.each(Object.entries(EXPLAINED_CHAPTERS).flatMap(([lv, ns]) => ns.map((n) => [lv, n] as const)))(
  "%s chapter %i explains every exercise",
  (lv, n) => {
    const ch = COURSE.find((c) => c.level === lv)!.chapters.find((c) => c.number === n)!;
    const all = [...ch.topics.flatMap((t) => t.exercises), ...(ch.quiz ?? [])];
    it("has an explanation on every exercise and quiz question", () => {
      for (const e of all) expect(e.explanation?.trim(), e.id).toBeTruthy();
    });
    it("tells the learner when a blank needs two words", () => {
      for (const e of all) if ((e.question.match(/___/g) ?? []).length >= 2) expect(e.question, e.id).toContain("duas palavras");
    });
  },
);
