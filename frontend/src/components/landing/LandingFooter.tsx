import { Link } from "react-router-dom";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { useT } from "@/i18n/LanguageContext";

export const LandingFooter = () => {
  const t = useT();
  const f = t.footer;

  return (
    <>
      {/* Curtain above the footer: it scrolls away to reveal the fixed footer underneath. */}
      <div
        className="relative z-10 w-full min-h-[70vh] bg-background flex flex-col items-center justify-center border-b border-border/60 shadow-md rounded-b-3xl"
        style={{ fontFamily: "'Orbit DM Sans', sans-serif" }}
      >
        <p className="text-2xl md:text-4xl font-normal tracking-[0.2em] text-muted-foreground mb-8 uppercase text-center px-4">
          {f.scrollHint}
        </p>
        <div aria-hidden="true" className="w-px h-32 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>

      <CinematicFooter
        heading={f.heading}
        giantText={f.giantText}
        marqueeItems={f.marquee}
        primaryAction={{ label: f.signUp, to: "/cadastro", as: Link }}
        links={[
          { label: f.links.termos, href: "#" },
          { label: f.links.privacidade, href: "#" },
          { label: f.links.suporte, href: `mailto:${f.supportEmail}` },
        ]}
        copyright={f.rights(new Date().getFullYear())}
        backToTopLabel={f.backToTop}
      />
    </>
  );
};
