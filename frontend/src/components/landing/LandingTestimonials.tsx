import { Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLanguage } from "@/i18n/LanguageContext";

const testimonialsByLocale = {
  pt: [
    {
      quote:
        "Em 3 meses sai do A1 e fui para Madrid sem medo de pedir comida ou conversar. A IA corrigindo minha escrita foi o que mudou tudo.",
      name: "Marina Silva",
      role: "Designer · Brasil",
      initials: "MS",
    },
    {
      quote:
        "Os jogos viciam. Faço caça-palavras no metrô e em duas semanas meu vocabulário dobrou. Léxico profissional foi o diferencial pro trabalho.",
      name: "Felipe Costa",
      role: "Engenheiro · Portugal",
      initials: "FC",
    },
    {
      quote:
        "Já tentei outros apps. Esse é o único que ensina espanhol da Espanha de verdade. As provas no fim de cada nível me forçam a estudar sério.",
      name: "Ana Beatriz",
      role: "Professora · Brasil",
      initials: "AB",
    },
  ],
  en: [
    {
      quote:
        "In 3 months I went from A1 to traveling to Madrid without fear of ordering food or chatting. The AI correcting my writing changed everything.",
      name: "Marina Silva",
      role: "Designer · Brazil",
      initials: "MS",
    },
    {
      quote:
        "The games are addictive. I do word search on the subway and in two weeks my vocabulary doubled. Professional vocab made the difference at work.",
      name: "Felipe Costa",
      role: "Engineer · Portugal",
      initials: "FC",
    },
    {
      quote:
        "I tried other apps. This is the only one that really teaches Spanish from Spain. The end-of-level tests force me to study seriously.",
      name: "Ana Beatriz",
      role: "Teacher · Brazil",
      initials: "AB",
    },
  ],
};

export const LandingTestimonials = () => {
  const { locale, t } = useLanguage();
  const testimonials = testimonialsByLocale[locale];

  return (
    <section id="testimonials" className="container -mt-2 sm:-mt-4 md:-mt-6 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/60 mb-4 sm:mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
              {t.landingTestimonials.eyebrow}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 sm:mb-5">
            {t.landingTestimonials.titlePart1}{" "}
            <span className="text-gradient-spain">{t.landingTestimonials.titleHighlight}</span>
          </h2>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {testimonials.map((tm, i) => (
          <Reveal key={tm.name} delay={i * 0.1} y={32}>
            <article className="h-full rounded-3xl bg-card border border-border/60 p-7 shadow-sm hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <blockquote className="text-foreground/90 leading-relaxed mb-6 flex-1">
                "{tm.quote}"
              </blockquote>
              <div className="flex items-center gap-3 pt-5 border-t border-border/60">
                <div className="w-11 h-11 rounded-full bg-gradient-spain flex items-center justify-center text-primary-foreground font-display font-extrabold text-sm">
                  {tm.initials}
                </div>
                <div>
                  <div className="font-bold text-sm">{tm.name}</div>
                  <div className="text-xs text-muted-foreground">{tm.role}</div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
