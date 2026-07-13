import { BookOpen, Gamepad2, Sparkles, Trophy, MessageSquare, BarChart3 } from "lucide-react";
import { Reveal } from "./Reveal";
import { useT } from "@/i18n/LanguageContext";

export const LandingFeatures = () => {
  const t = useT();

  const features = [
    { icon: BookOpen, ...t.features.items.book },
    { icon: Sparkles, ...t.features.items.ai },
    { icon: Gamepad2, ...t.features.items.games },
    { icon: Trophy, ...t.features.items.tests },
    { icon: MessageSquare, ...t.features.items.spain },
    { icon: BarChart3, ...t.features.items.progress },
  ];

  return (
    <section id="features" className="container py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14 md:mb-16">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/60 mb-4 sm:mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
              {t.features.eyebrow}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4 sm:mb-5">
            {t.features.titlePart1}{" "}
            <span className="text-gradient-spain">{t.features.titleHighlight}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-base sm:text-lg text-muted-foreground">{t.features.subtitle}</p>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08} y={32}>
            <div className="group relative h-full rounded-3xl border border-border/60 bg-card p-5 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated hover:border-primary/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-spain flex items-center justify-center mb-4 sm:mb-5 shadow-card group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl mb-2 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
