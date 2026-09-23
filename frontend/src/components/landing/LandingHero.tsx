import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import OrbitDeliveryHero from "@/components/ui/orbit-delivery-hero";
import { SpanishLogo } from "@/components/SpanishLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/LanguageContext";

export const LandingHero = () => {
  const t = useT();
  const h = t.hero;

  const navItems = [
    { label: t.nav.comoFunciona, href: "#como-funciona" },
    { label: t.nav.destinos, href: "#destinos" },
    { label: t.nav.jogos, href: "#jogos" },
    { label: t.nav.cursos, href: "#cursos" },
    { label: t.nav.precos, href: "#precos" },
  ];

  return (
    <OrbitDeliveryHero
      theme="light"
      content={{
        brand: (
          <Link to="/" aria-label="Spanish AI" className="wordmark">
            <SpanishLogo size={38} withText={false} />
            <span className="brand-type">
              Spanish AI<small>{h.brandTagline}</small>
            </span>
          </Link>
        ),
        navLabel: t.nav.menu,
        navItems,
        headerActions: (
          <>
            <LanguageSwitcher />
            <Link to="/login" className="header-cta">
              {t.nav.entrar}
            </Link>
          </>
        ),
        eyebrow: h.eyebrow,
        title: (
          <>
            {h.titleLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            <em>{h.titleEm}</em>
          </>
        ),
        description: h.description,
        cta: (
          <Link to="/cadastro" className="explore-button">
            {h.ctaPrimary} <ArrowRight strokeWidth={1.6} />
          </Link>
        ),
        captionIdle: h.captionIdle,
        captionDragging: h.captionDragging,
        captionPaused: h.captionPaused,
        footerLeft: h.footerLeft,
        footerRight: h.footerRight,
        loading: h.loading,
        fallback: h.fallback,
        retry: h.retry,
        planetLabel: h.planetLabel,
        instructions: h.instructions,
        pause: h.pause,
        start: h.start,
        pauseLabel: h.pauseLabel,
        startLabel: h.startLabel,
      }}
    />
  );
};
