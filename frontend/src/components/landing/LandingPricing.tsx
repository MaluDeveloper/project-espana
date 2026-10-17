import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageContext";

export const LandingPricing = () => {
  const t = useT();

  const plans = [
    { ...t.pricing.plans.free, href: "/cadastro", highlight: false },
    { ...t.pricing.plans.monthly, href: "/cadastro", highlight: false },
    { ...t.pricing.plans.annual, href: "/cadastro", highlight: true },
  ];

  return (
    <section
      id="pricing"
      className="container py-16 sm:py-20 md:py-24 lg:py-32"
      style={{ fontFamily: "'Orbit DM Sans', sans-serif" }}
    >
      <div className="mx-auto text-center mb-10 sm:mb-14">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/60 mb-4 sm:mb-5">
            <span className="text-xs font-medium uppercase tracking-[0.36em] text-accent-foreground">
              {t.pricing.eyebrow}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {/* One line from sm up: the size scales with the viewport so the full title always fits. */}
          <h2 className="font-[550] text-3xl sm:text-[clamp(1.5rem,3.6vw,3.25rem)] sm:whitespace-nowrap tracking-[-0.064em] leading-[1.15] mb-4 sm:mb-5">
            {t.pricing.titlePart1}{" "}
            <span
              className="text-gradient-spain italic font-normal text-[1.12em] tracking-[-0.035em] pr-[0.08em]"
              style={{ fontFamily: "'Orbit Libre Caslon', Georgia, serif" }}
            >
              {t.pricing.titleHighlight}
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground">{t.pricing.subtitle}</p>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} y={32}>
            <div
              className={cn(
                "relative h-full rounded-3xl p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-2",
                p.highlight
                  ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-primary shadow-elevated md:scale-[1.02]"
                  : "bg-card border-border/60 shadow-sm hover:shadow-elevated",
              )}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap shadow-card">
                  {t.pricing.highlightBadge}
                </div>
              )}
              <div className="font-[550] text-lg tracking-[-0.02em] mb-1">{p.name}</div>
              <p
                className={cn(
                  "text-sm mb-5",
                  p.highlight ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {p.desc}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-[550] text-4xl tracking-[-0.04em]">
                  {p.price}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    p.highlight ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {p.period}
                </span>
              </div>
              <Button
                asChild
                size="lg"
                variant={p.highlight ? "secondary" : "outline"}
                className="w-full mb-6 font-normal"
              >
                <Link to={p.href}>{p.cta}</Link>
              </Button>
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        p.highlight ? "text-secondary" : "text-success",
                      )}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
