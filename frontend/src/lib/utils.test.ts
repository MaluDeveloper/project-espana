import { describe, expect, it } from "vitest";
import { normalizeAnswer } from "./utils";

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
