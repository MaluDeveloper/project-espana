import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { useT } from "@/i18n/LanguageContext";

export const LandingCTA = () => {
  const t = useT();
  return (
    <section className="container py-16 sm:py-20 md:py-24 lg:py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] bg-gradient-navy p-6 sm:p-10 md:p-16 lg:p-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.35),transparent_50%),radial-gradient(circle_at_80%_80%,hsl(var(--secondary)/0.25),transparent_50%)]" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-navy-foreground mb-4 sm:mb-5 tracking-tight">
              {t.cta.title}
            </h2>
            <p className="text-navy-foreground/80 text-base sm:text-lg md:text-xl mb-6 sm:mb-10 max-w-xl mx-auto leading-relaxed">
              {t.cta.subtitle}
            </p>
            <Button
              asChild
              size="xl"
              variant="hero"
              className="group shadow-elevated w-full sm:w-auto"
            >
              <Link to="/cadastro">
                {t.cta.button}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
