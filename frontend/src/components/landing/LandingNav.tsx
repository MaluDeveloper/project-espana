import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

// The hero renders its own header, so this sticky nav only slides in after scrolling past it.
const SCROLL_THRESHOLD = 120;

// Mirrors the hero header (orbit-delivery-hero): same font, sizes and colors. The font is
// registered by the hero's @font-face, which is always mounted on the landing page.
const HERO_FONT = { fontFamily: "'Orbit DM Sans', sans-serif" };

export const LandingNav = () => {
  const t = useT();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t.nav.comoFunciona, href: "#como-funciona" },
    { label: t.nav.jogos, href: "#jogos" },
    { label: t.nav.cursos, href: "#cursos" },
    { label: t.nav.precos, href: "#precos" },
    { label: t.nav.destinos, href: "#destinos" },
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
      initial={{ y: "-100%", opacity: 0 }}
      animate={showSolid ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={!showSolid}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/60 shadow-sm",
        !showSolid && "pointer-events-none",
      )}
      style={HERO_FONT}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] h-[76px] items-center gap-4 px-5 md:px-[5%] min-[1151px]:px-[6.5%]">
        <Link
          to="/"
          aria-label="Spanish AI"
          className="justify-self-start text-[26px] min-[1151px]:text-[29px] font-semibold tracking-[-1.5px] text-[#2a160b]"
        >
          Spanish <span className="text-gradient-spain">AI</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-[22px] min-[1151px]:gap-10 justify-self-center">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="py-3 text-[13px] min-[1151px]:text-[15px] whitespace-nowrap text-[#6e4c38] hover:text-[#ec6b1c] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-1">
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex items-center rounded-[23px] px-[22px] py-[13px] text-[13px] text-white bg-gradient-spain shadow-[inset_0_1px_0_#ffffff26] transition-[filter] hover:brightness-110"
            >
              {t.nav.entrar}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-1">
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
              <Button asChild variant="hero" size="sm">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  {t.nav.entrar}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
