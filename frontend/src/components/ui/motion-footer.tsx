import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// This project's theme tokens are HSL triplets ("354 35% 14%"), so every token is wrapped in hsl().
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  font-family: 'Orbit DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, hsl(var(--foreground)) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, hsl(var(--foreground)) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, hsl(var(--primary)) 15%, transparent) 0%,
    color-mix(in oklch, hsl(var(--secondary)) 15%, transparent) 40%,
    transparent 70%
  );
}

/* Gradient pill — same orange gradient as the rest of the landing's buttons */
.footer-gradient-pill {
  background: var(--gradient-spain);
  color: white;
  box-shadow: 0 10px 30px -10px color-mix(in oklch, hsl(var(--primary)) 45%, transparent), inset 0 1px 0 #ffffff30;
  transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-gradient-pill:hover {
  filter: brightness(1.08);
  box-shadow: 0 20px 40px -10px color-mix(in oklch, hsl(var(--primary)) 55%, transparent), inset 0 1px 0 #ffffff30;
}

/* Colorless pill for secondary links: transparent fill, hairline border */
.footer-ghost-pill {
  background: transparent;
  color: hsl(var(--muted-foreground));
  border: 1px solid color-mix(in oklch, hsl(var(--foreground)) 15%, transparent);
  transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-ghost-pill:hover {
  color: hsl(var(--foreground));
  border-color: color-mix(in oklch, hsl(var(--foreground)) 35%, transparent);
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 700; /* the hero font tops out at 700 */
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, hsl(var(--foreground)) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, hsl(var(--foreground)) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, hsl(var(--foreground)) 0%, color-mix(in oklch, hsl(var(--foreground)) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, hsl(var(--foreground)) 15%, transparent));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
    /** Forwarded to router links when `as` is react-router's Link. */
    to?: string;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
export interface CinematicFooterLink {
  label: string;
  href: string;
}

export interface CinematicFooterProps {
  heading: string;
  /** Huge outlined word behind the content. */
  giantText: string;
  marqueeItems: readonly string[];
  primaryAction: { label: string; to: string; as: React.ElementType };
  links: readonly CinematicFooterLink[];
  copyright: string;
  backToTopLabel: string;
}

const MarqueeItem = ({ items }: { items: readonly string[] }) => (
  <div className="flex items-center space-x-12 px-6">
    {items.map((item, i) => (
      <React.Fragment key={item}>
        <span>{item}</span>
        <span className={i % 2 === 0 ? "text-primary/60" : "text-secondary/60"}>✦</span>
      </React.Fragment>
    ))}
  </div>
);

export function CinematicFooter({
  heading,
  giantText,
  marqueeItems,
  primaryAction,
  links,
  copyright,
  backToTopLabel,
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/*
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box.
      */}
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground cinematic-footer-wrapper">

          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            aria-hidden="true"
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            {giantText}
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div
            aria-hidden="true"
            // Below the landing's fixed 76px navbar (plus room for the -2° tilt), which would otherwise cover it.
            className="absolute top-32 left-0 w-full overflow-hidden border-y border-border/50 bg-background/60 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-2xl"
          >
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-medium tracking-[0.36em] text-muted-foreground uppercase">
              <MarqueeItem items={marqueeItems} />
              <MarqueeItem items={marqueeItems} />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-48 md:mt-64 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              // Padding keeps the last glyph and descenders inside the background-clip:text area.
              className="text-5xl md:text-8xl font-[550] leading-[1.03] footer-text-glow tracking-[-0.064em] mb-12 text-center px-[0.12em] pb-[0.1em]"
            >
              {heading}
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  as={primaryAction.as}
                  to={primaryAction.to}
                  className="footer-gradient-pill px-10 py-5 rounded-full font-normal text-base flex items-center gap-3"
                >
                  {primaryAction.label}
                </MagneticButton>
              </div>

              {/* Secondary Text Links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                {links.map((link) => (
                  <MagneticButton
                    key={link.label}
                    as="a"
                    href={link.href}
                    className="footer-ghost-pill px-6 py-3 rounded-full font-normal text-[13px]"
                  >
                    {link.label}
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-muted-foreground text-[10px] md:text-xs font-normal tracking-[0.25em] uppercase text-center md:text-left">
              {copyright}
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              type="button"
              onClick={scrollToTop}
              aria-label={backToTopLabel}
              className="w-12 h-12 rounded-full footer-gradient-pill flex items-center justify-center group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
