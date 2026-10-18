import { describe, it, expect, beforeEach } from "vitest";
import { COURSE } from "@/data/courses";
import { getChapterCompletionPercent, markExerciseCorrect, markTopicRead } from "@/lib/course-progress";

const ch = COURSE.find((c) => c.level === "A1")!.chapters[0];

describe("getChapterCompletionPercent", () => {
  beforeEach(() => localStorage.clear());

  it("ignores topic and exercise ids that no longer exist in the chapter", () => {
    for (let i = 0; i < 10; i++) {
      markTopicRead("A1", ch.id, `ghost-topic-${i}`);
      markExerciseCorrect("A1", ch.id, `ghost-ex-${i}`);
    }
    expect(getChapterCompletionPercent("A1", ch.id)).toBe(0);
  });

  it("still counts ids that exist", () => {
    markTopicRead("A1", ch.id, ch.topics[0].id);
    markTopicRead("A1", ch.id, "ghost-topic");
    expect(getChapterCompletionPercent("A1", ch.id)).toBe(Math.round(50 / ch.topics.length));
  });
});
