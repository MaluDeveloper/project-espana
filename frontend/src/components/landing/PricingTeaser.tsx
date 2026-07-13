import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { useT } from "@/i18n/LanguageContext";

export const PricingTeaser = () => {
  const t = useT();
  const teaser = t.pricingTeaser;

  return (
    <section className="container py-16 md:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl md:rounded-[2rem] border border-border/60 bg-card shadow-card px-6 py-10 md:px-12 md:py-12">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 md:justify-between text-center md:text-left">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/60 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
                  {teaser.eyebrow}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mb-2">
                {teaser.title}
              </h3>
              <p className="text-muted-foreground">{teaser.subtitle}</p>
            </div>
            <Button asChild size="lg" variant="hero" className="group shrink-0">
              <a href="#precos">
                {teaser.button}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
