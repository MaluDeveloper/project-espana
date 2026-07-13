import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, RefreshCw, Sparkles } from "lucide-react";
import { getCourseLevel, PASS_THRESHOLD } from "@/data/courses";
import { EXAM_BANKS, type ExamMC, type ExamDiscursive } from "@/data/exam-banks";
import { saveExam } from "@/lib/course-progress";
import type { LevelId } from "@/data/games";
import { cn } from "@/lib/utils";

const MC_PER_ATTEMPT = 10;
const DISCURSIVE_PER_ATTEMPT = 5;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const usedKey = (level: string) => `spanish-ai-exam-used-${level}`;

const readUsed = (level: string): string[] => {
  try {
    const raw = localStorage.getItem(usedKey(level));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

interface DrawResult {
  mc: ExamMC[];
  discursive: ExamDiscursive[];
  resetNotice: boolean;
}

const drawQuestions = (level: LevelId): DrawResult | null => {
  const bank = EXAM_BANKS[level];
  if (!bank) return null;
  let used = readUsed(level);
  let availMC = bank.multipleChoice.filter((q) => !used.includes(q.id));
  let availDis = bank.discursive.filter((q) => !used.includes(q.id));
  let resetNotice = false;

  if (availMC.length < MC_PER_ATTEMPT || availDis.length < DISCURSIVE_PER_ATTEMPT) {
    resetNotice = true;
    used = [];
    availMC = bank.multipleChoice;
    availDis = bank.discursive;
  }

  const mc = shuffle(availMC).slice(0, MC_PER_ATTEMPT);
  const discursive = shuffle(availDis).slice(0, DISCURSIVE_PER_ATTEMPT);
  const newUsed = [...used, ...mc.map((q) => q.id), ...discursive.map((q) => q.id)];
  localStorage.setItem(usedKey(level), JSON.stringify(newUsed));

  return { mc, discursive, resetNotice };
};

interface FinishedResult {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
}

const Prueba = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const course = level ? getCourseLevel(level as LevelId) : undefined;

  const [draw, setDraw] = useState<DrawResult | null>(() => (course ? drawQuestions(course.level) : null));
  const [idx, setIdx] = useState(0);
  const [mcAnswers, setMcAnswers] = useState<Record<string, string>>({});
  const [discAnswers, setDiscAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState("");
  const [finished, setFinished] = useState<FinishedResult | null>(null);

  // Garante que mudanças de nível recriem o sorteio
  useEffect(() => {
    if (course) {
      setDraw(drawQuestions(course.level));
      setIdx(0);
      setMcAnswers({});
      setDiscAnswers({});
      setCurrent("");
      setFinished(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.level]);

  if (!course) return <Navigate to="/cursos" replace />;
  if (!draw) return <Navigate to="/cursos" replace />;

  const allQuestions = useMemo(
    () => [
      ...draw.mc.map((q) => ({ kind: "mc" as const, q })),
      ...draw.discursive.map((q) => ({ kind: "disc" as const, q })),
    ],
    [draw],
  );

  const total = allQuestions.length;
  const currentItem = allQuestions[idx];

  const handleNext = () => {
    if (!current.trim()) return;
    if (currentItem.kind === "mc") {
      setMcAnswers((prev) => ({ ...prev, [currentItem.q.id]: current }));
    } else {
      setDiscAnswers((prev) => ({ ...prev, [currentItem.q.id]: current }));
    }
    setCurrent("");

    if (idx + 1 < total) {
      setIdx(idx + 1);
      return;
    }

    // Finalizou — calcula score com base nas múltiplas escolhas
    const updatedMc =
      currentItem.kind === "mc"
        ? { ...mcAnswers, [currentItem.q.id]: current }
        : mcAnswers;

    const mcTotal = draw.mc.length;
    const score = draw.mc.reduce((sum, q) => {
      const answered = (updatedMc[q.id] ?? "").trim();
      return sum + (answered === q.answer ? 1 : 0);
    }, 0);
    const percent = mcTotal ? score / mcTotal : 0;
    const passed = percent >= PASS_THRESHOLD;
    saveExam(course.level, score, mcTotal);
    setFinished({ score, total: mcTotal, percent, passed });
  };

  const restart = () => {
    const next = drawQuestions(course.level);
    setDraw(next);
    setIdx(0);
    setMcAnswers({});
    setDiscAnswers({});
    setCurrent("");
    setFinished(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to={`/cursos/${course.level}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para o nível
      </Link>

      {draw.resetNotice && !finished && (
        <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm flex items-start gap-2">
          <Sparkles className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span>Você completou todas as questões disponíveis! Recomeçando com novas combinações.</span>
        </div>
      )}

      {!finished ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline">{course.level}</Badge>
            <Badge variant="secondary">Prova final · {Math.round(PASS_THRESHOLD * 100)}% para aprovar</Badge>
            <Badge variant="outline">{currentItem.kind === "mc" ? "Múltipla escolha" : "Discursiva"}</Badge>
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-6">
            Pergunta {idx + 1} de {total}
          </h1>
          <Progress value={(idx / total) * 100} className="h-2 mb-8" />

          <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-card">
            <p className="font-display text-xl md:text-2xl mb-6">{currentItem.q.question}</p>

            {currentItem.kind === "mc" ? (
              <div className="grid gap-2">
                {currentItem.q.options.map((opt) => (
                  <Button
                    key={opt}
                    variant={current === opt ? "spain" : "outline"}
                    onClick={() => setCurrent(opt)}
                    className="justify-start text-left h-auto py-3 whitespace-normal"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="Escreva sua resposta em espanhol…"
                  className="min-h-32 text-base"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">💡 {currentItem.q.tip}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} disabled={!current.trim()} variant="spain" size="lg">
                {idx + 1 === total ? "Finalizar prova" : "Próxima"} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div
            className={cn(
              "rounded-3xl p-8 md:p-10 text-center shadow-elevated",
              finished.passed ? "bg-gradient-spain text-primary-foreground" : "bg-card border border-border",
            )}
          >
            {finished.passed ? (
              <>
                <Trophy className="w-12 h-12 mx-auto mb-3" />
                <h2 className="font-display text-3xl md:text-4xl mb-2">Aprovado!</h2>
                <p className="text-lg opacity-90 mb-2">
                  Você acertou {finished.score}/{finished.total} ({Math.round(finished.percent * 100)}%).
                </p>
                <p className="text-sm opacity-80 mb-6">Parabéns! As discursivas servem para sua autoavaliação.</p>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 mx-auto mb-3 text-destructive" />
                <h2 className="font-display text-3xl md:text-4xl mb-2">Reprovado</h2>
                <p className="text-lg text-muted-foreground mb-2">
                  Você acertou {finished.score}/{finished.total} ({Math.round(finished.percent * 100)}%).
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Você precisa de pelo menos {Math.ceil(finished.total * PASS_THRESHOLD)} acertos. Revise e tente novamente.
                </p>
              </>
            )}
          </div>

          {/* Múltipla escolha */}
          <div className="mt-6 bg-card rounded-3xl border border-border p-5 md:p-6">
            <h3 className="font-display text-xl mb-4">Múltipla escolha</h3>
            <ul className="space-y-3">
              {draw.mc.map((q, i) => {
                const userAns = (mcAnswers[q.id] ?? "").trim();
                const ok = userAns === q.answer;
                return (
                  <li
                    key={q.id}
                    className={cn(
                      "rounded-2xl border p-3 text-sm flex gap-3 items-start",
                      ok ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5",
                    )}
                  >
                    {ok ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {i + 1}. {q.question}
                      </p>
                      <p className="mt-1 text-xs">
                        Sua resposta: <span className="font-semibold">{userAns || "—"}</span>
                      </p>
                      {!ok && (
                        <p className="text-xs text-muted-foreground">
                          Correta: <span className="font-semibold text-foreground">{q.answer}</span>
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Discursivas */}
          <div className="mt-6 bg-card rounded-3xl border border-border p-5 md:p-6">
            <h3 className="font-display text-xl mb-4">Discursivas — autoavaliação</h3>
            <ul className="space-y-4">
              {draw.discursive.map((q, i) => (
                <li key={q.id} className="rounded-2xl border border-border p-4">
                  <p className="font-medium mb-3">
                    {i + 1}. {q.question}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Sua resposta</p>
                      <p className="text-sm whitespace-pre-wrap">{(discAnswers[q.id] ?? "").trim() || "—"}</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
                      <p className="text-xs uppercase tracking-wide text-primary mb-1">Exemplo correto</p>
                      <p className="text-sm whitespace-pre-wrap">{q.example}</p>
                      <p className="text-xs text-muted-foreground mt-2">💡 {q.tip}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <Button onClick={restart} variant="spain">
              <RefreshCw className="w-4 h-4" /> Refazer prova
            </Button>
            <Button onClick={() => navigate(`/cursos/${course.level}`)} variant="outline">
              Voltar ao curso <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Prueba;
