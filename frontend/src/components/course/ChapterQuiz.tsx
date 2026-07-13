import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, RotateCcw, Sparkles } from "lucide-react";
import type { Exercise } from "@/data/courses";
import { pickL, pickLArr } from "@/data/courses";
import type { LevelId } from "@/data/games";
import { saveChapterQuiz, getChapterQuiz } from "@/lib/course-progress";
import { cn } from "@/lib/utils";

interface ChapterQuizProps {
  level: LevelId;
  chapterId: string;
  questions: Exercise[];
  locale: "pt" | "en";
  labels: {
    title: string;
    subtitle: string;
    question: (c: number, t: number) => string;
    check: string;
    next: string;
    finish: string;
    correct: string;
    incorrect: string;
    answer: string;
    score: (s: number, t: number) => string;
    passed: string;
    failed: string;
    retake: string;
    badge: string;
    bestScore: (s: number, t: number) => string;
    placeholder: string;
    noQuestions: string;
  };
}

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

export const ChapterQuiz = ({ level, chapterId, questions, locale, labels }: ChapterQuizProps) => {
  const pool = useMemo(() => shuffle(questions), [questions]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "right" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const scoreRef = useRef(0); // ref síncrono garante valor correto ao salvar
  const prev = getChapterQuiz(level, chapterId);

  if (!questions.length) {
    return <p className="text-sm text-muted-foreground">{labels.noQuestions}</p>;
  }

  const restart = () => {
    setIdx(0);
    setAnswer("");
    setFeedback("idle");
    setScore(0);
    scoreRef.current = 0;
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / pool.length) * 100);
    const passed = pct >= 70;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "p-6 rounded-3xl border-2 text-center",
          passed ? "bg-success/10 border-success/40" : "bg-destructive/5 border-destructive/30"
        )}
      >
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-3 bg-background shadow-card">
          {passed ? <Trophy className="w-8 h-8 text-success" /> : <XCircle className="w-8 h-8 text-destructive" />}
        </div>
        <h3 className="font-display text-2xl mb-1">{passed ? labels.passed : labels.failed}</h3>
        <p className="text-lg font-bold mb-1">{labels.score(score, pool.length)} · {pct}%</p>
        {passed && (
          <Badge className="bg-success text-success-foreground gap-1 mb-3">
            <Sparkles className="w-3 h-3" /> {labels.badge}
          </Badge>
        )}
        <div className="mt-4">
          <Button onClick={restart} variant="outline">
            <RotateCcw className="w-4 h-4" /> {labels.retake}
          </Button>
        </div>
      </motion.div>
    );
  }

  const current = pool[idx];
  const questionText = pickL(current.question, current.questionEn, locale);
  const opts = current.options ? pickLArr(current.options, current.optionsEn, locale) : undefined;
  const explanation = current.explanation ? pickL(current.explanation, current.explanationEn, locale) : undefined;
  const progressPct = Math.round(((idx + (feedback !== "idle" ? 1 : 0)) / pool.length) * 100);

  const check = () => {
    const ok = answer.trim().toLowerCase() === current.answer.trim().toLowerCase();
    setFeedback(ok ? "right" : "wrong");
    if (ok) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
  };

  const next = () => {
    if (idx + 1 >= pool.length) {
      saveChapterQuiz(level, chapterId, scoreRef.current, pool.length);
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setAnswer("");
    setFeedback("idle");
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between text-sm font-semibold mb-2">
          <span>{labels.question(idx + 1, pool.length)}</span>
          {prev && (
            <span className="text-xs text-muted-foreground">
              {labels.bestScore(prev.score, prev.total)}
            </span>
          )}
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border">
        <p className="font-medium text-lg mb-4">{questionText}</p>

        {current.type === "multiple-choice" && opts ? (
          <div className="grid sm:grid-cols-3 gap-2">
            {opts.map((opt, i) => {
              const real = current.options![i];
              return (
                <Button
                  key={real}
                  variant={answer === real ? "spain" : "outline"}
                  size="sm"
                  onClick={() => setAnswer(real)}
                  disabled={feedback !== "idle"}
                  className="justify-start text-left h-auto py-2"
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        ) : (
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={labels.placeholder}
            disabled={feedback !== "idle"}
          />
        )}

        {feedback !== "idle" && (
          <div className={cn(
            "mt-4 p-3 rounded-xl text-sm",
            feedback === "right" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}>
            <div className="flex items-center gap-2 font-bold">
              {feedback === "right" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {feedback === "right" ? labels.correct : labels.incorrect}
            </div>
            {feedback === "wrong" && (
              <div className="mt-1 text-foreground/80">{labels.answer} <strong>{current.answer}</strong></div>
            )}
            {explanation && <div className="mt-1 text-foreground/80">{explanation}</div>}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          {feedback === "idle" ? (
            <Button onClick={check} disabled={!answer}>{labels.check}</Button>
          ) : (
            <Button onClick={next} variant="spain">
              {idx + 1 >= pool.length ? labels.finish : labels.next}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
