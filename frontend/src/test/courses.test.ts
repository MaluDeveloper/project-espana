import { describe, it, expect } from "vitest";
import { COURSE } from "@/data/courses";

describe("COURSE data", () => {
  it("has the six levels with 13 chapters each", () => {
    expect(COURSE.map((c) => c.level)).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    for (const c of COURSE) expect(c.chapters).toHaveLength(13);
  });

  it("no level carries the unused static `exam` field", () => {
    for (const c of COURSE) expect(Object.keys(c)).not.toContain("exam");
  });
});
