import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Sparkles,
  X,
  Trophy,
  Lightbulb,
} from "lucide-react";
import lessonMarket from "@/assets/lesson-market.jpg";
import lessonBeach from "@/assets/lesson-beach.jpg";
import lessonKitchen from "@/assets/lesson-kitchen.jpg";

type LessonContent = {
  title: string;
  image: string;
  validWords: string[];
  fillSentences: { before: string; answer: string; after: string }[];
  storyPrompt: string;
};

const LESSONS: Record<string, LessonContent> = {
  mercado: {
    title: "El mercado",
    image: lessonMarket,
    validWords: ["naranja", "tomate", "pimiento", "jamón", "pan", "limón", "fruta", "cesta", "mercado"],
    fillSentences: [
      { before: "En el mercado compro", answer: "naranjas", after: "frescas cada mañana." },
      { before: "Me gusta el", answer: "jamón", after: "ibérico de España." },
      { before: "El", answer: "pan", after: "huele riquísimo aquí." },
    ],
    storyPrompt: "Conte uma pequena história sobre uma manhã de sábado no mercado da Espanha, usando ao menos 3 palavras do vocabulário.",
  },
  playa: {
    title: "La playa",
    image: lessonBeach,
    validWords: ["playa", "mar", "arena", "sombrilla", "sol", "barco", "palmera", "verano", "agua"],
    fillSentences: [
      { before: "En verano voy a la", answer: "playa", after: "con mi familia." },
      { before: "Bajo la", answer: "sombrilla", after: "leo un libro." },
      { before: "El", answer: "mar", after: "está muy tranquilo hoy." },
    ],
    storyPrompt: "Descreva um dia perfeito de verão na praia espanhola, com sensações e detalhes.",
  },
  cocina: {
    title: "La cocina",
    image: lessonKitchen,
    validWords: ["paella", "ajo", "tomate", "aceite", "sartén", "pimiento", "cocina", "azafrán"],
    fillSentences: [
      { before: "Para hacer", answer: "paella", after: "necesito azafrán." },
      { before: "Pongo", answer: "aceite", after: "en la sartén caliente." },
      { before: "Corto el", answer: "ajo", after: "muy fino." },
    ],
    storyPrompt: "Conte como você prepara sua receita espanhola favorita, passo a passo.",
  },
};

const STEPS = ["Imagem", "Lacunas", "Escrita", "Resultado"] as const;
type Step = (typeof STEPS)[number];

interface AIResult {
  corrected: string;
  errors: { original: string; suggestion: string; reason: string }[];
  connectors: string[];
  vocabulary: string[];
  feedback: string;
}

// Mock da IA — simula POST /analyze
const mockAnalyze = async (text: string): Promise<AIResult> => {
  await new Promise((r) => setTimeout(r, 1400));
  return {
    corrected:
      text.trim() ||
      "Hoy fui al mercado y compré naranjas frescas. Sin embargo, también probé jamón ibérico delicioso.",
    errors: [
      {
        original: "fui al mercado y compré",
        suggestion: "fui al mercado, donde compré",
        reason: "Use «donde» para conectar lugar e ação de forma mais fluida.",
      },
      {
        original: "pero",
        suggestion: "sin embargo",
        reason: "Em registro mais formal, «sin embargo» soa mais natural.",
      },
    ],
    connectors: ["sin embargo", "además", "por lo tanto", "mientras tanto"],
    vocabulary: ["riquísimo", "fresco", "delicioso", "tradicional"],
    feedback:
      "¡Muy bien! Sua estrutura está clara. Trabalhe conectores e variação de vocabulário para um nível B1+.",
  };
};

const Aula = () => {
  const { id = "mercado" } = useParams();
  const navigate = useNavigate();
  const lesson = useMemo(() => LESSONS[id] ?? LESSONS.mercado, [id]);

  const [step, setStep] = useState<Step>("Imagem");
  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  // Etapa 1
  const [wordInput, setWordInput] = useState("");
  const [words, setWords] = useState<{ word: string; valid: boolean }[]>([]);
  const addWord = () => {
    const w = wordInput.trim().toLowerCase();
    if (!w) return;
    if (words.some((x) => x.word === w)) {
      toast.message("Você já adicionou essa palavra");
      setWordInput("");
      return;
    }
    const valid = lesson.validWords.includes(w);
    setWords((prev) => [...prev, { word: w, valid }]);
    if (valid) toast.success(`¡Correcto! "${w}"`);
    else toast.error(`"${w}" no está en esta imagen`);
    setWordInput("");
  };
  const validCount = words.filter((w) => w.valid).length;
  const canAdvanceStep1 = validCount >= 3;

  // Etapa 2
  const [fillAnswers, setFillAnswers] = useState<string[]>(lesson.fillSentences.map(() => ""));
  const fillCorrect = fillAnswers.filter(
    (a, i) => a.trim().toLowerCase() === lesson.fillSentences[i].answer.toLowerCase(),
  ).length;
  const canAdvanceStep2 = fillAnswers.every((a) => a.trim().length > 0);

  // Etapa 3
  const [story, setStory] = useState("");
  const canAdvanceStep3 = story.trim().split(/\s+/).length >= 8;

  // Etapa 4
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setStep("Resultado");
    try {
      const r = await mockAnalyze(story);
      setResult(r);
    } catch {
      toast.error("Falha ao analisar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon" aria-label="Voltar">
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {lesson.title} · Etapa {stepIndex + 1} de {STEPS.length}
              </span>
              <span className="text-xs font-bold text-primary">{step}</span>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ===== Etapa 1: Imagem ===== */}
          {step === "Imagem" && (
            <motion.section
              key="img"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              <div>
                <h1 className="font-display text-3xl md:text-4xl mb-2">
                  ¿Qué ves en la <span className="text-gradient-spain">imagen?</span>
                </h1>
                <p className="text-muted-foreground">
                  Escreva pelo menos 3 palavras em espanhol que descrevam a cena.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-elevated">
                <img
                  src={lesson.image}
                  alt={`Cena: ${lesson.title}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="bg-card rounded-3xl p-5 md:p-6 border border-border shadow-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addWord();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Escribe una palabra..."
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    className="h-12 text-base"
                    autoFocus
                  />
                  <Button type="submit" variant="spain" size="lg">
                    <Plus className="w-4 h-4" />
                  </Button>
                </form>

                <div className="flex flex-wrap gap-2 mt-4 min-h-[44px]">
                  <AnimatePresence>
                    {words.map((w, i) => (
                      <motion.div
                        key={w.word + i}
                        initial={{ opacity: 0, scale: 0.6, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className={`px-3 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1.5 border-2 ${
                          w.valid
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }`}
                      >
                        {w.valid ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        {w.word}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>
                    Acertos: <strong className="text-foreground">{validCount}</strong> / 3
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="spain"
                  size="lg"
                  disabled={!canAdvanceStep1}
                  onClick={() => setStep("Lacunas")}
                >
                  Continuar <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.section>
          )}

          {/* ===== Etapa 2: Lacunas ===== */}
          {step === "Lacunas" && (
            <motion.section
              key="fill"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              <div>
                <h1 className="font-display text-3xl md:text-4xl mb-2">
                  Completa las <span className="text-gradient-spain">frases</span>
                </h1>
                <p className="text-muted-foreground">
                  Use palavras do vocabulário para preencher as lacunas.
                </p>
              </div>

              <div className="space-y-3">
                {lesson.fillSentences.map((s, i) => {
                  const answered = fillAnswers[i].trim().length > 0;
                  const correct = fillAnswers[i].trim().toLowerCase() === s.answer.toLowerCase();
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-card rounded-2xl p-5 border border-border shadow-card"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-base md:text-lg">
                        <span>{s.before}</span>
                        <Input
                          value={fillAnswers[i]}
                          onChange={(e) =>
                            setFillAnswers((prev) =>
                              prev.map((v, idx) => (idx === i ? e.target.value : v)),
                            )
                          }
                          placeholder="..."
                          className={`inline-block w-32 h-10 text-center font-semibold ${
                            answered
                              ? correct
                                ? "border-success bg-success/10"
                                : "border-destructive bg-destructive/10"
                              : ""
                          }`}
                        />
                        <span>{s.after}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm text-muted-foreground">
                  Corretas: <strong className="text-foreground">{fillCorrect}</strong> /{" "}
                  {lesson.fillSentences.length}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep("Imagem")}>
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </Button>
                  <Button
                    variant="spain"
                    size="lg"
                    disabled={!canAdvanceStep2}
                    onClick={() => setStep("Escrita")}
                  >
                    Continuar <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.section>
          )}

          {/* ===== Etapa 3: Escrita ===== */}
          {step === "Escrita" && (
            <motion.section
              key="write"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              <div>
                <h1 className="font-display text-3xl md:text-4xl mb-2">
                  Escreva sua <span className="text-gradient-spain">história</span>
                </h1>
                <p className="text-muted-foreground">{lesson.storyPrompt}</p>
              </div>

              <div className="bg-card rounded-3xl p-2 border border-border shadow-card">
                <Textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Empieza tu historia aquí..."
                  className="min-h-[220px] border-0 text-base leading-relaxed resize-none focus-visible:ring-0 bg-transparent"
                  autoFocus
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-secondary/20 border border-secondary/40 rounded-2xl">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong>Dica:</strong> use conectores como{" "}
                  <code className="px-1.5 py-0.5 rounded bg-background font-semibold">además</code>,{" "}
                  <code className="px-1.5 py-0.5 rounded bg-background font-semibold">sin embargo</code>,{" "}
                  <code className="px-1.5 py-0.5 rounded bg-background font-semibold">mientras</code>.
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  {story.trim().split(/\s+/).filter(Boolean).length} palavras
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep("Lacunas")}>
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    disabled={!canAdvanceStep3}
                    onClick={handleAnalyze}
                  >
                    <Sparkles className="w-4 h-4" /> Analisar com IA
                  </Button>
                </div>
              </div>
            </motion.section>
          )}

          {/* ===== Etapa 4: Resultado ===== */}
          {step === "Resultado" && (
            <motion.section
              key="result"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              {loading || !result ? (
                <div className="bg-card rounded-3xl p-10 md:p-14 border border-border shadow-card text-center">
                  <h2 className="font-display text-2xl mb-2">Pensando en español...</h2>
                  <p className="text-muted-foreground mb-6">
                    A IA está analisando sua escrita.
                  </p>
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-5 rounded-3xl bg-gradient-spain text-primary-foreground shadow-elevated">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80 mb-1">
                        <Trophy className="w-3.5 h-3.5" /> Aula concluída · +80 XP
                      </div>
                      <p className="font-display text-xl leading-tight">{result.feedback}</p>
                    </div>
                  </div>

                  <ResultCard title="Texto corrigido" accent="success">
                    <p className="text-base leading-relaxed">{result.corrected}</p>
                  </ResultCard>

                  <ResultCard title="Erros e melhorias" accent="primary">
                    <ul className="space-y-3">
                      {result.errors.map((e, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <div className="text-sm">
                              <span className="line-through text-muted-foreground">{e.original}</span>{" "}
                              <span className="text-success font-semibold">→ {e.suggestion}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">{e.reason}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ResultCard>

                  <div className="grid md:grid-cols-2 gap-4">
                    <ResultCard title="Conectores sugeridos" accent="secondary">
                      <div className="flex flex-wrap gap-2">
                        {result.connectors.map((c) => (
                          <span
                            key={c}
                            className="px-3 py-1.5 rounded-full bg-secondary/30 border border-secondary/50 text-sm font-semibold"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </ResultCard>
                    <ResultCard title="Vocabulário extra" accent="primary">
                      <div className="flex flex-wrap gap-2">
                        {result.vocabulary.map((v) => (
                          <span
                            key={v}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </ResultCard>
                  </div>

                  <div className="flex justify-between gap-3 pt-2">
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                      Voltar ao dashboard
                    </Button>
                    <Button variant="spain" size="lg" onClick={() => navigate("/dashboard")}>
                      Próxima aula <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>
    </div>
  );
};

const ResultCard = ({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent: "success" | "primary" | "secondary";
}) => {
  const dot = {
    success: "bg-success",
    primary: "bg-primary",
    secondary: "bg-secondary",
  }[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl p-5 md:p-6 border border-border shadow-card"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <h3 className="font-display text-lg">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
};

export default Aula;
