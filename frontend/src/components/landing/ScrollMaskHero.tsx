import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import toroRoadtrip from "@/assets/toro-roadtrip.jpg";

/**
 * ScrollMaskHero
 * --------------
 * "Scroll Mask Expansion" effect:
 * - A full-screen Spain-flag gradient overlay covers the bull image.
 * - The phrase "VAMOS A ESPAÑA" is cut out (knockout) of the overlay,
 *   acting as a window into the background image.
 * - On scroll-in the phrase holds at a readable size for a beat (the section
 *   is sticky-pinned, so it visually "parks"), then gradually scales up
 *   until the overlay disappears off the edges, revealing the full image.
 * - Fully reversible by scrolling back up.
 *
 * Implementation notes
 * - We use an SVG <mask> where white = visible (overlay shown) and black = hole.
 *   The text is rendered black, so the area under the text becomes transparent
 *   in the overlay layer, exposing the image beneath.
 * - The whole scene is sticky inside a tall container, giving us scroll runway.
 */
export const ScrollMaskHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Track scroll progress across the tall outer section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Drive the text scale: holds readable at 1x while the section "parks" on
  // scroll-in (0 → 0.22), then ramps up gradually — a gentle early climb
  // followed by the final push — instead of one abrupt linear jump.
  const textScale = useTransform(scrollYProgress, [0, 0.22, 0.55, 0.95], [1, 1, 22, 90]);
  // Fade the colored overlay out near the very end, once the reveal is done.
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.85, 0.97], [1, 1, 0]);
  // Bring in the speech bubble right after the reveal completes.
  const bubbleOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const bubbleY = useTransform(scrollYProgress, [0.9, 1], [24, 0]);

  return (
    <section
      ref={sectionRef}
      aria-label="Vamos a España — apresentação imersiva"
      // Tall container = scroll runway for the sticky scene.
      // Aumentado para 400vh para tornar a rolagem mais lenta e suave
      className="relative h-[400vh] bg-background"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background: the bull roadtrip image (always visible underneath) */}
        <img
          src={toroRoadtrip}
          alt="Touro dirigindo um conversível vermelho com cachecol da Espanha rumo à aventura"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />

        {/* Subtle vignette to keep text edges crisp on bright zones */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,hsl(0_0%_0%/0.35)_100%)]"
        />

        {/* The Spain-flag overlay with a text-shaped knockout */}
        <motion.div
          aria-hidden
          style={{ opacity: reduceMotion ? 0 : overlayOpacity }}
          className="absolute inset-0"
        >
          <svg
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              {/* Spain flag gradient (red → gold → red) */}
              <linearGradient id="spainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#AA151B" />
                <stop offset="50%" stopColor="#F1BF00" />
                <stop offset="100%" stopColor="#AA151B" />
              </linearGradient>

              {/* Knockout mask: white shows the overlay, black creates the window */}
              <mask id="textMask">
                <rect width="100%" height="100%" fill="white" />
                <motion.text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="96"
                  fontWeight="900"
                  letterSpacing="-1"
                  fontFamily='"Poppins","Inter",system-ui,sans-serif'
                  fill="black"
                  className="[font-size:96px] sm:[font-size:118px] md:[font-size:140px]"
                  style={{
                    scale: reduceMotion ? 1 : (textScale as unknown as number),
                    transformOrigin: "50% 50%",
                  }}
                >
                  VAMOS A ESPAÑA
                </motion.text>
              </mask>
            </defs>

            {/* The colored layer that gets punched through */}
            <rect
              width="100%"
              height="100%"
              fill="url(#spainGrad)"
              mask="url(#textMask)"
            />
          </svg>

          {/* Helper hint — stays put during the "parked" phase, fades as the zoom kicks in */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.32], [1, 1, 0]) }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/90 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] font-bold whitespace-nowrap"
          >
            ↓ Role para revelar
          </motion.div>
        </motion.div>

        {/* Floating speech bubble — appears after the reveal */}
        <motion.div
          style={{ opacity: bubbleOpacity, y: bubbleY }}
          className="absolute left-1/2 top-[10%] sm:top-[14%] -translate-x-1/2 md:left-auto md:right-[6%] md:top-[18%] md:translate-x-0 max-w-[min(88vw,28rem)] px-3"
        >
          <div className="relative bg-card text-card-foreground rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-6 sm:py-4 md:px-7 md:py-5 shadow-2xl ring-2 ring-secondary/60">
            <p className="font-display font-extrabold text-base sm:text-lg md:text-2xl leading-tight text-center">
              ¡Tu aventura comienza{" "}
              <span className="text-gradient-spain">aquí!</span>
            </p>
            <p className="mt-1 text-xs sm:text-sm md:text-base text-muted-foreground text-center font-medium">
              Únete a nosotros.
            </p>
            {/* Tail */}
            <span
              aria-hidden
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card rotate-45 ring-2 ring-secondary/60"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
