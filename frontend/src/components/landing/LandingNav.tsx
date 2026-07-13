import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SpanishLogo } from "@/components/SpanishLogo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 40;

export const LandingNav = () => {
  const t = useT();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t.nav.comoFunciona, href: "#como-funciona" },
    { label: t.nav.destinos, href: "#destinos" },
    { label: t.nav.jogos, href: "#jogos" },
    { label: t.nav.cursos, href: "#cursos" },
    { label: t.nav.precos, href: "#precos" },
  ];

  useEffect(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > SCROLL_THRESHOLD);
  });

  const showSolid = scrolled || mobileOpen;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        showSolid
          ? "bg-background/80 backdrop-blur-md border-b border-border/60 shadow-sm"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container grid grid-cols-[1fr_auto_1fr] h-16 md:h-18 items-center gap-4">
        <Link to="/" aria-label="Spanish AI" className="justify-self-start">
          <SpanishLogo light={!showSolid} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 justify-self-center">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={cn(
                "px-3 py-2 text-sm font-semibold rounded-lg transition-colors story-link",
                showSolid
                  ? "text-foreground/80 hover:text-foreground"
                  : "text-white/90 hover:text-white",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-1">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher light={!showSolid} />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "transition-colors",
                !showSolid && "text-white/90 hover:text-white hover:bg-white/10",
              )}
            >
              <Link to="/login">{t.nav.entrar}</Link>
            </Button>
            <Button asChild variant="hero" size="sm" className="shadow-card">
              <Link to="/cadastro">{t.nav.comecarGratis}</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher light={!showSolid} />
            <button
              className={cn(
                "p-2 rounded-lg transition-colors",
                showSolid
                  ? "text-foreground hover:bg-accent/60"
                  : "text-white hover:bg-white/10",
              )}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={t.nav.menu}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-accent/60"
                >
                  {l.label}
                </a>
              ))}
              <div className="h-px bg-border my-2" />
              <Button asChild variant="ghost" size="sm" className="justify-start">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  {t.nav.entrar}
                </Link>
              </Button>
              <Button asChild variant="hero" size="sm">
                <Link to="/cadastro" onClick={() => setMobileOpen(false)}>
                  {t.nav.comecarGratis}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
