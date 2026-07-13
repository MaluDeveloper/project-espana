import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Clock, GraduationCap, Lightbulb, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDeleCourse, type DeleBlock } from "@/data/dele";
import { useLanguage } from "@/i18n/LanguageContext";

const pick = (pt: string, en: string | undefined, locale: "pt" | "en") =>
  locale === "en" && en ? en : pt;
const pickArr = (pt: string[], en: string[] | undefined, locale: "pt" | "en") =>
  locale === "en" && en && en.length === pt.length ? en : pt;

const renderBlock = (b: DeleBlock, i: number, locale: "pt" | "en") => {
  switch (b.kind) {
    case "heading":
      return (
        <h3 key={i} className="font-display text-xl mt-6 mb-2">
          {pick(b.text, b.textEn, locale)}
        </h3>
      );
    case "paragraph":
      return (
        <p key={i} className="text-foreground/90 leading-relaxed mb-3">
          {pick(b.text, b.textEn, locale)}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="space-y-1.5 mb-4 list-disc pl-5 text-foreground/90">
          {pickArr(b.items, b.itemsEn, locale).map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div
          key={i}
          className="my-4 p-4 rounded-2xl bg-secondary/20 border border-secondary/40 flex gap-3"
        >
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">{pick(b.text, b.textEn, locale)}</p>
        </div>
      );
    case "table":
      return (
        <div key={i} className="my-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {pickArr(b.headers, b.headersEn, locale).map((h, idx) => (
                  <th key={idx} className="text-left p-3 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} className="border-t border-border">
                  {row.map((c, idx) => (
                    <td key={idx} className="p-3">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
};

const DeleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const course = id ? getDeleCourse(id) : undefined;
  const { locale } = useLanguage();

  if (!course) return <Navigate to="/dashboard/cursos" replace />;

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/dashboard/cursos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para Cursos
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-secondary/40 text-xs font-bold mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-primary" /> DELE · Instituto Cervantes
        </div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="outline" className="font-bold">
            {course.level}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" /> {course.duration}
          </Badge>
          <Badge className="bg-success text-success-foreground gap-1">
            <Award className="w-3 h-3" /> Aprovação {course.passScore}
          </Badge>
        </div>
        <h1 className="font-display text-3xl md:text-4xl mb-2">
          {pick(course.title, course.titleEn, locale)}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {pick(course.description, course.descriptionEn, locale)}
        </p>
      </motion.div>

      <div className="space-y-6">
        {course.sections.map((section) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-card"
          >
            <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-primary" />
              {pick(section.title, section.titleEn, locale)}
            </h2>
            <div className="prose-content">
              {section.blocks.map((b, i) => renderBlock(b, i, locale))}
            </div>
          </motion.section>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="outline">
          <Link to="/dashboard/cursos">
            <ArrowLeft className="w-4 h-4" /> Todos os cursos
          </Link>
        </Button>
        <Button asChild variant="spain">
          <a
            href="https://examenes.cervantes.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            Site oficial DELE
          </a>
        </Button>
      </div>
    </div>
  );
};

export default DeleDetail;
