import { heroEyebrowClass, heroFontStyle, heroHighlightClass, heroHighlightStyle } from "./heroTypography";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
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
      style={heroFontStyle}
    >
      <div className="mx-auto text-center mb-10 sm:mb-14">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/60 mb-4 sm:mb-5">
            <span className={heroEyebrowClass}>
              {t.pricing.eyebrow}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {/* One line from sm up: the size scales with the viewport so the full title always fits. */}
          <h2 className="font-[550] text-3xl sm:text-[clamp(1.5rem,3.6vw,3.25rem)] sm:whitespace-nowrap tracking-[-0.064em] leading-[1.15] mb-4 sm:mb-5">
            {t.pricing.titlePart1}{" "}
            <span
              className={heroHighlightClass}
              style={heroHighlightStyle}
            >
              {t.pricing.titleHighlight}
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground">{t.pricing.subtitle}</p>
        </Reveal>
      </div>

      {/* Cards slide in from the left one after another. */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.25} x={-120} y={0} duration={0.8}>
            {/* Same card for every plan; the recommended one only gets the badge. */}
            <div className="hover-gradient-border relative h-full rounded-3xl p-6 sm:p-8 border bg-card border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated">
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-spain text-white text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap shadow-card">
                  {t.pricing.highlightBadge}
                </div>
              )}
              <div className="text-xs font-bold uppercase tracking-[0.25em] mb-2 text-primary">{p.name}</div>
              <h3 className="font-[550] text-xl tracking-[-0.03em] leading-tight mb-2">{p.headline}</h3>
              <p className="text-sm mb-5 text-muted-foreground">{p.desc}</p>
              <div className="flex flex-col gap-1 mb-6">
                <span className="font-[550] text-4xl tracking-[-0.04em]">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <Link
                to={p.href}
                className="w-full mb-6 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-gradient-spain text-white text-base shadow-[inset_0_1px_0_#ffffff30] transition-[filter,transform] hover:brightness-110 hover:-translate-y-0.5"
              >
                {p.cta}
                <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
              </Link>
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-success" />
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
