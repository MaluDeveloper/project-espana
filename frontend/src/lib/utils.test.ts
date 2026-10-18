import { describe, expect, it } from "vitest";
import { isAnswerCorrect, normalizeAnswer } from "./utils";

describe("normalizeAnswer", () => {
  it("ignores case and accents", () => {
    expect(normalizeAnswer("Está")).toBe(normalizeAnswer("esta"));
  });

  it("ignores punctuation, including inverted marks", () => {
    expect(normalizeAnswer("¿Dónde vives?")).toBe(normalizeAnswer("donde vives"));
    expect(normalizeAnswer("Nunca he comido sushi.")).toBe(normalizeAnswer("nunca he comido sushi"));
  });

  it("collapses extra whitespace", () => {
    expect(normalizeAnswer("  he   desayunado ")).toBe("he desayunado");
  });

  it("still distinguishes different words", () => {
    expect(normalizeAnswer("he comido")).not.toBe(normalizeAnswer("he bebido"));
  });
});

describe("isAnswerCorrect", () => {
  it("requires an exact match for multiple-choice", () => {
    expect(isAnswerCorrect({ type: "multiple-choice", answer: "éramos" }, "eramos")).toBe(false);
  });

  it("accepts the exact multiple-choice option", () => {
    expect(isAnswerCorrect({ type: "multiple-choice", answer: "éramos" }, "éramos")).toBe(true);
  });

  it("ignores accents for fill-blank", () => {
    expect(isAnswerCorrect({ type: "fill-blank", answer: "éramos" }, "eramos")).toBe(true);
  });

  it("ignores case for fill-blank", () => {
    expect(isAnswerCorrect({ type: "fill-blank", answer: "más que" }, "Más que")).toBe(true);
  });
});
