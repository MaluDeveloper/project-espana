import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, BookMarked, CheckCircle2, Lightbulb, Sparkles, ArrowRight, Trophy, AlertTriangle } from "lucide-react";
import { getCourseLevel, pickL, pickLArr, type LexiconEntry, type Topic, type TopicBlock, type Exercise } from "@/data/courses";
import {
  getChapterProgress,
  markExerciseCorrect,
  markTopicRead,
  registerStudyToday,
  getChapterCompletionPercent,
  isChapterUnlocked,
} from "@/lib/course-progress";
import { registerStudyHeartbeat, STUDY_HEARTBEAT_MS } from "@/lib/dashboard-stats";
import type { LevelId } from "@/data/games";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { AudioButton } from "@/components/course/AudioButton";
import { Flashcards } from "@/components/course/Flashcards";
import { ChapterQuiz } from "@/components/course/ChapterQuiz";

const lexiconBadge: Record<NonNullable<LexiconEntry["tag"]>, string> = {
  profesional: "bg-primary/10 text-primary border-primary/20",
  coloquial: "bg-secondary/30 text-secondary-foreground border-secondary/40",
  formal: "bg-muted text-foreground border-border",
  expresión: "bg-success/10 text-success border-success/20",
};

const renderBlock = (block: TopicBlock, idx: number, locale: "pt" | "en", tc: any) => {
  switch (block.kind) {
    case "heading":
      return <h3 key={idx} className="font-display text-xl mt-6 mb-2">{pickL(block.text, block.textEn, locale)}</h3>;
    case "paragraph":
      return <p key={idx} className="text-foreground/90 leading-relaxed mb-3">{pickL(block.text, block.textEn, locale)}</p>;
    case "list":
      return (
        <ul key={idx} className="space-y-1.5 mb-4 list-disc pl-5 text-foreground/90">
          {pickLArr(block.items, block.itemsEn, locale).map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      );
    case "example":
      return (
        <div key={idx} className="my-4 p-4 rounded-2xl bg-accent/40 border border-accent">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">{tc.ejemplo}</div>
            <div className="flex items-center gap-1">
              <AudioButton text={block.es} label={tc.audioOuvir} />
              <AudioButton text={block.es} slow label={tc.audioLento} />
            </div>
          </div>
          <p className="font-display text-lg mb-1">"{block.es}"</p>
          <p className="text-sm text-muted-foreground italic">{locale === "en" && block.en ? block.en : block.pt}</p>
        </div>
      );
    case "tip":
      return (
        <div key={idx} className="my-4 p-4 rounded-2xl bg-secondary/20 border border-secondary/40 flex gap-3">
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">{pickL(block.text, block.textEn, locale)}</p>
        </div>
      );
    case "table":
      return (
        <div key={idx} className="my-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{pickLArr(block.headers, block.headersEn, locale).map((h, i) => <th key={i} className="text-left p-3 font-bold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t border-border">
                  {row.map((c, i) => <td key={i} className="p-3">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
};

const ExerciseCard = ({
  exercise, level, chapterId, alreadyDone, onCorrect, locale, tc,
}: {
  exercise: Exercise;
  level: LevelId;
  chapterId: string;
  alreadyDone: boolean;
  onCorrect: () => void;
  locale: "pt" | "en";
  tc: any;
}) => {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "right" | "wrong">(alreadyDone ? "right" : "idle");

  const check = () => {
    const ok = answer.trim().toLowerCase() === exercise.answer.trim().toLowerCase();
    setStatus(ok ? "right" : "wrong");
    if (ok) {
      markExerciseCorrect(level, chapterId, exercise.id);
      onCorrect();
    }
  };

  const displayQuestion = pickL(exercise.question, exercise.questionEn, locale);
  const displayOptions = exercise.options ? pickLArr(exercise.options, exercise.optionsEn, locale) : undefined;
  const displayExplanation = exercise.explanation ? pickL(exercise.explanation, exercise.explanationEn, locale) : undefined;

  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-colors",
      status === "right" ? "bg-success/10 border-success/30" :
      status === "wrong" ? "bg-destructive/5 border-destructive/30" :
      "bg-card border-border",
    )}>
      <div className="flex items-start gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary mt-1 shrink-0" />
        <p className="font-medium">{displayQuestion}</p>
      </div>
      {exercise.type === "multiple-choice" && displayOptions && exercise.options ? (
        <div className="grid sm:grid-cols-3 gap-2">
          {displayOptions.map((opt, i) => {
            const realValue = exercise.options![i];
            return (
              <Button
                key={realValue}
                variant={answer === realValue ? "spain" : "outline"}
                size="sm"
                onClick={() => setAnswer(realValue)}
                disabled={status === "right"}
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
          placeholder={tc.respostaPlaceholder}
          disabled={status === "right"}
        />
      )}
      <div className="flex items-center justify-between gap-3 mt-3">
        <div className="text-sm">
          {status === "right" && <span className="text-success font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {tc.correto}</span>}
          {status === "wrong" && <span className="text-destructive">{tc.tenteOutra}</span>}
          {status === "right" && displayExplanation && <span className="text-muted-foreground ml-2">{displayExplanation}</span>}
        </div>
        <Button size="sm" onClick={check} disabled={!answer || status === "right"}>
          {tc.comprovar}
        </Button>
      </div>
    </div>
  );
};

const Capitulo = () => {
  const { level, chapterId } = useParams<{ level: string; chapterId: string }>();
  const course = level ? getCourseLevel(level as LevelId) : undefined;
  const chapter = course?.chapters.find((c) => c.id === chapterId);
  const { locale, t } = useLanguage();
  const tc = t.cursos.capitulo;

  const [progress, setProgress] = useState(() =>
    course && chapter ? getChapterProgress(course.level, chapter.id) : { topicsRead: [], exercisesCorrect: [] }
  );
  const [percent, setPercent] = useState(() =>
    course && chapter ? getChapterCompletionPercent(course.level, chapter.id) : 0
  );

  const [tab, setTab] = useState<string>("conteudo");
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (!course || !chapter) return;
    registerStudyToday();
    setProgress(getChapterProgress(course.level, chapter.id));
    setPercent(getChapterCompletionPercent(course.level, chapter.id));
  }, [course, chapter]);

  // Rastreia tempo de estudo real: soma segundos em intervalos enquanto a aba está visível,
  // em vez de assumir 30min fixos por dia que o aluno visitou um capítulo.
  useEffect(() => {
    if (!course || !chapter) return;
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        registerStudyHeartbeat();
      }
    }, STUDY_HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, [course, chapter]);

  // Marca os tópicos como lidos quando o aluno entra na aba "Conteúdo" e atualiza progresso a cada troca de aba.
  useEffect(() => {
    if (!course || !chapter) return;
    if (tab === "conteudo") {
      chapter.topics.forEach((tp) => markTopicRead(course.level, chapter.id, tp.id));
    }
    setProgress(getChapterProgress(course.level, chapter.id));
    setPercent(getChapterCompletionPercent(course.level, chapter.id));
  }, [tab, course, chapter]);

  // Dispara celebração ao atingir 100%.
  useEffect(() => {
    if (percent >= 100 && !celebrated) {
      setCelebrated(true);
      const t = setTimeout(() => setCelebrated(false), 4200);
      return () => clearTimeout(t);
    }
  }, [percent, celebrated]);

  const nextChapter = useMemo(() => {
    if (!course || !chapter) return undefined;
    const idx = course.chapters.findIndex((c) => c.id === chapter.id);
    return course.chapters[idx + 1];
  }, [course, chapter]);

  const allExercises = useMemo<Exercise[]>(() => {
    if (!chapter) return [];
    return chapter.topics.flatMap((tp) => tp.exercises);
  }, [chapter]);

  const quizQuestions = useMemo<Exercise[]>(() => {
    if (!chapter) return [];
    return chapter.quiz && chapter.quiz.length ? chapter.quiz : allExercises;
  }, [chapter, allExercises]);

  const flashcardEntries = useMemo<LexiconEntry[]>(() => {
    if (!chapter) return [];
    return chapter.flashcards && chapter.flashcards.length ? chapter.flashcards : chapter.lexicon;
  }, [chapter]);

  if (!course || !chapter) return <Navigate to="/cursos" replace />;
  if (!isChapterUnlocked(course.level, chapter.id)) return <Navigate to={`/cursos/${course.level}`} replace />;

  const refresh = () => {
    setProgress(getChapterProgress(course.level, chapter.id));
    setPercent(getChapterCompletionPercent(course.level, chapter.id));
  };

  const chapterTitle = pickL(chapter.title, chapter.titleEn, locale);
  const chapterSummary = pickL(chapter.summary, chapter.summaryEn, locale);
  const lexiconTagLabel = (tag?: LexiconEntry["tag"]) => (tag ? (tc.tags as any)[tag] ?? tag : "");

  return (
    <div className="max-w-4xl mx-auto">
      <Link to={`/cursos/${course.level}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> {tc.voltar(course.level)}
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{course.level}</Badge>
          <Badge variant="secondary">{tc.capitulo} {chapter.number}</Badge>
          {percent >= 70 && (
            <Badge className="bg-success text-success-foreground gap-1">
              <CheckCircle2 className="w-3 h-3" /> {percent}%
            </Badge>
          )}
        </div>
        <h1 className="font-display text-3xl md:text-4xl mb-2">{chapterTitle}</h1>
        <p className="text-muted-foreground text-lg mb-4">{chapterSummary}</p>
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-muted-foreground">
            <span>{tc.progressoLabel}</span>
            <span className="tabular-nums">{percent}%</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>
      </motion.div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6 h-auto">
          <TabsTrigger value="conteudo">{tc.tabs.conteudo}</TabsTrigger>
          <TabsTrigger value="exercicios">{tc.tabs.exercicios}</TabsTrigger>
          <TabsTrigger value="quiz">{tc.tabs.quiz}</TabsTrigger>
          <TabsTrigger value="revisao">{tc.tabs.revisao}</TabsTrigger>
        </TabsList>

        {/* CONTEÚDO */}
        <TabsContent value="conteudo" className="space-y-10">
          {chapter.topics.map((topic: Topic) => (
            <motion.section
              key={topic.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-card"
            >
              <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-primary" /> {pickL(topic.title, topic.titleEn, locale)}
              </h2>
              <div className="prose-content">
                {topic.blocks.map((b, i) => renderBlock(b, i, locale, tc))}
              </div>
            </motion.section>
          ))}

          {/* Léxico no conteúdo (cards estáticos) */}
          <section className="bg-gradient-card rounded-3xl p-6 md:p-8 border border-border shadow-card">
            <h2 className="font-display text-2xl mb-1 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary" /> {tc.lexicoTitulo}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">{tc.lexicoSubtitulo}</p>
            <div className="grid md:grid-cols-2 gap-3">
              {chapter.lexicon.map((entry) => (
                <div key={entry.es} className="p-4 rounded-2xl bg-card border border-border">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="font-display text-lg font-bold">{entry.es}</div>
                      <AudioButton text={entry.es} />
                    </div>
                    {entry.tag && (
                      <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border", lexiconBadge[entry.tag])}>
                        {lexiconTagLabel(entry.tag)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-foreground/80 mb-1.5">
                    {locale === "en" && entry.en ? entry.en : entry.pt}
                  </div>
                  {entry.example && <div className="text-xs italic text-muted-foreground">"{entry.example}"</div>}
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* EXERCÍCIOS */}
        <TabsContent value="exercicios" className="space-y-6">
          {chapter.topics.map((topic) => (
            <section key={topic.id} className="bg-card rounded-3xl p-6 border border-border shadow-card">
              <h3 className="font-display text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> {pickL(topic.title, topic.titleEn, locale)}
              </h3>
              <div className="space-y-3">
                {topic.exercises.map((ex) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    level={course.level}
                    chapterId={chapter.id}
                    alreadyDone={progress.exercisesCorrect.includes(ex.id)}
                    onCorrect={refresh}
                    locale={locale}
                    tc={tc}
                  />
                ))}
              </div>
            </section>
          ))}
        </TabsContent>

        {/* QUIZ */}
        <TabsContent value="quiz">
          <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-card">
            <div className="mb-5">
              <h2 className="font-display text-2xl mb-1 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" /> {tc.quizTitulo}
              </h2>
              <p className="text-sm text-muted-foreground">{tc.quizSub}</p>
            </div>
            <ChapterQuiz
              level={course.level}
              chapterId={chapter.id}
              questions={quizQuestions}
              locale={locale}
              labels={tc.quizLabels}
            />
          </div>
        </TabsContent>

        {/* REVISÃO */}
        <TabsContent value="revisao" className="space-y-6">
          <section className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-card">
            <h2 className="font-display text-2xl mb-3 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary" /> {tc.revisaoTitulo}
            </h2>
            <div>
              <h3 className="font-display text-lg mb-1">{tc.revisaoResumo}</h3>
              <p className="text-foreground/90 leading-relaxed">
                {pickL(chapter.briefReview ?? chapter.summary, chapter.briefReviewEn ?? chapter.summaryEn, locale)}
              </p>
            </div>
            <div className="mt-5">
              <h3 className="font-display text-lg mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> {tc.revisaoTopicos ?? "Tópicos do capítulo"}
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/90">
                {chapter.topics.map((tp) => (
                  <li key={tp.id}>{pickL(tp.title, tp.titleEn, locale)}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-card">
            <h2 className="font-display text-2xl mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> {tc.vocabularioTitulo}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{tc.vocabularioSub}</p>
            <Flashcards entries={flashcardEntries} locale={locale} labels={tc.flashcards} />
          </section>
        </TabsContent>
      </Tabs>

      <div className="mt-10 flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="outline">
          <Link to={`/cursos/${course.level}`}><ArrowLeft className="w-4 h-4" /> {tc.todosCapitulos}</Link>
        </Button>
        {nextChapter ? (
          <Button asChild variant="spain">
            <Link to={`/cursos/${course.level}/capitulo/${nextChapter.id}`}>
              {tc.proxCapitulo} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="spain">
            <Link to={`/cursos/${course.level}/prueba`}>
              {tc.fazerProva} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>

      <AnimatePresence>
        {celebrated && (
          <motion.div
            key="celebrate-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setCelebrated(false)}
          >
            <motion.div
              initial={{ scale: 0.6, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="bg-card border border-border rounded-3xl shadow-elevated p-8 text-center max-w-sm mx-4"
            >
              <h3 className="font-display text-2xl mb-1">¡Enhorabuena!</h3>
              <p className="text-muted-foreground mb-4">
                Você concluiu 100% do capítulo {chapter.number}.
              </p>
              <Button variant="spain" onClick={() => setCelebrated(false)}>
                Continuar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Capitulo;
