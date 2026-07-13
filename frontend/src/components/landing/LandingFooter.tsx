import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { SpanishLogo } from "@/components/SpanishLogo";
import { useT } from "@/i18n/LanguageContext";

export const LandingFooter = () => {
  const t = useT();
  const year = new Date().getFullYear();

  const groups = [
    {
      title: t.footer.product,
      links: [
        { label: t.footer.links.cursos, href: "#cursos" },
        { label: t.footer.links.comoFunciona, href: "#como-funciona" },
        { label: t.footer.links.jogos, href: "#jogos" },
        { label: t.footer.links.precos, href: "#precos" },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.links.sobre, href: "#" },
        { label: t.footer.links.blog, href: "#" },
        { label: t.footer.links.contato, href: "#" },
        { label: t.footer.links.termos, href: "#" },
        { label: t.footer.links.privacidade, href: "#" },
      ],
    },
    {
      title: t.footer.support,
      links: [
        { label: t.footer.links.ajuda, href: "#" },
        { label: t.footer.links.faq, href: "#" },
        {
          label: t.footer.links.emailSuporte,
          href: `mailto:${t.footer.links.emailSuporte}`,
          icon: Mail,
          external: true,
        },
      ],
    },
  ] as const;

  const socials = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter / X", icon: Twitter, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-gradient-hero-deep text-navy-foreground">
      {/* Ambient glows for premium feel */}
      <div
        aria-hidden
        className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-primary/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-secondary/10 blur-3xl pointer-events-none"
      />
      {/* Top gradient hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-foreground/20 to-transparent"
      />

      <div className="container relative py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12 md:mb-16">
          {/* COL 1 — BRAND */}
          <div className="lg:col-span-4">
            <SpanishLogo light />
            <p className="text-sm md:text-base text-navy-foreground mt-5 max-w-xs leading-relaxed">
              {t.footer.tagline}
            </p>

            {/* Socials */}
            <div className="mt-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-foreground mb-3">
                {t.footer.socialLabel}
              </p>
              <div className="flex items-center gap-2.5">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      className="group/social grid place-items-center w-10 h-10 rounded-full bg-navy-foreground/[0.06] border border-navy-foreground/10 text-navy-foreground transition-all duration-300 hover:bg-primary hover:border-primary hover:text-primary-foreground hover:scale-110 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-navy"
                    >
                      <Icon className="w-4 h-4 transition-transform duration-300 group-hover/social:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLS 2-4 — LINK GROUPS */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {groups.map((g) => (
              <div key={g.title}>
                <h4 className="font-display font-extrabold text-xs uppercase tracking-[0.2em] text-navy-foreground mb-5">
                  {g.title}
                </h4>
                <ul className="space-y-3">
                  {g.links.map((l) => {
                    const isExternal = "external" in l && l.external;
                    const LinkIcon = "icon" in l ? l.icon : null;
                    const isAnchor = l.href.startsWith("#");
                    const linkClasses =
                      "group/link inline-flex items-center gap-1.5 text-sm text-navy-foreground hover:text-navy-foreground transition-colors duration-200";

                    if (isExternal) {
                      return (
                        <li key={l.label}>
                          <a href={l.href} className={linkClasses}>
                            {LinkIcon && <LinkIcon className="w-3.5 h-3.5 opacity-70" />}
                            <span className="border-b border-transparent group-hover/link:border-primary transition-colors">
                              {l.label}
                            </span>
                          </a>
                        </li>
                      );
                    }

                    if (isAnchor) {
                      return (
                        <li key={l.label}>
                          <a href={l.href} className={linkClasses}>
                            <span className="relative">
                              {l.label}
                              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-primary transition-all duration-300 group-hover/link:w-full" />
                            </span>
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li key={l.label}>
                        <Link to={l.href} className={linkClasses}>
                          <span className="relative">
                            {l.label}
                            <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-primary transition-all duration-300 group-hover/link:w-full" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 border-t border-navy-foreground/10 flex items-center justify-center text-xs sm:text-sm text-navy-foreground">
          <span>{t.footer.rights(year)}</span>
        </div>
      </div>
    </footer>
  );
};
