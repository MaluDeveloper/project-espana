// Built using Hyperiux Vault: https://vault.hyperiux.com
// Adapted: steps, title, aside and an action come in as props, the track widths / reveal
// positions are tuned for 5 alternating steps, and each copy block slides up
// through a mask instead of being split into lines (SplitText measured the lines
// before the landing's web font loaded, breaking them in the wrong places).

import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Inline stand-in for @gsap/react's useGSAP. Mirrors its default
   `revertOnUpdate: false`: one gsap.context lives for the component's
   lifetime, the callback is re-added when dependencies change, and the
   context is reverted only on unmount. A callback may return its own
   cleanup, which runs before the next re-add and on unmount. */
function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export type TimelineItem = {
  id: string;
  /** Short marker shown above the title, e.g. "01". */
  label: string;
  title: string;
  content: string;
};

export type TimelineProps = {
  /** Steps in order; they alternate above (even index) and below (odd index) the line. */
  items: readonly TimelineItem[];
  title?: ReactNode;
  /** Text under the title, in the lower half of the track. */
  aside?: ReactNode;
  /** Rendered centered under the track (e.g. a CTA); it stays put while the steps slide past. */
  action?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Reveal animation duration, in seconds. */
  duration?: number;
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

/** Scroll window (in % of the section) in which each step draws its stem and reveals its copy. */
function revealPositions(count: number, isMobile: boolean) {
  const [first, last, span] = isMobile ? [22, 66, 10] : [8, 60, 18];
  const step = count > 1 ? (last - first) / (count - 1) : 0;
  return Array.from({ length: count }, (_, i) => {
    const start = first + i * step;
    return [start, start + span] as const;
  });
}

export default function Timeline({
  items,
  title,
  aside,
  action,
  id = "journey",
  className = "",
  style,
  textColor = "hsl(var(--foreground))",
  mutedTextColor = "hsl(var(--muted-foreground))",
  activeColor = "hsl(var(--primary))",
  backgroundColor = "hsl(var(--background))",
  imageUrl,
  imageAlt = "",
  duration,
  scrollDuration = 1.2,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationDuration = duration ?? scrollDuration;
  const normalizedDuration = Math.max(0.2, animationDuration);
  const topItems = items.filter((_, i) => i % 2 === 0);
  const bottomItems = items.filter((_, i) => i % 2 === 1);
  const sectionStyle: CSSProperties = {
    ...style,
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const labelStyle: CSSProperties = {
    color: activeColor,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    const isMobile = window.innerWidth < 600;
    const slidePercent = isMobile ? -77 : -52;
    const lineWidth = isMobile ? "92%" : "98%";
    const lineStart = isMobile ? "top 30%" : "top 25%";
    const slideEnd = isMobile ? "82% 50%" : "92% bottom";
    const lineEnd = isMobile ? "80% 50%" : "92% bottom";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: slideEnd,
        scrub: true,
      },
      defaults: {
        ease: "none",
      },
    });

    tl.fromTo(
      wholeSliderRef.current,
      { xPercent: 0 },
      { xPercent: slidePercent },
    );

    if (reducedMotion) {
      gsap.set(".journey-line", { width: lineWidth });
      return;
    }

    // Entrance, like the landing's other sections: image, title, aside and action rise in
    // as the section scrolls into view, before the track starts sliding.
    gsap.from(".journey-intro", {
      opacity: 0,
      y: 48,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        once: true,
      },
    });

    gsap.to(".journey-line", {
      width: lineWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: lineStart,
        end: lineEnd,
        scrub: true,
      },
    });
  }, { dependencies: [reducedMotion], scope: sectionRef });

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (reducedMotion) {
      items.forEach((item) => {
        gsap.set(`.jl-${item.id}`, { scaleY: 1 });
        gsap.set(`.jd-${item.id}`, { scale: 1 });
        gsap.set(`.title-${item.id}, .description-${item.id}`, { yPercent: 0 });
      });
      return;
    }

    items.forEach((item) => {
      gsap.set(`.jl-${item.id}`, {
        scaleY: 0,
        transformOrigin: "bottom bottom",
      });
      gsap.set(`.jd-${item.id}`, { scale: 0 });
    });

    const createItemTimeline = (
      item: TimelineItem,
      isTop: boolean,
      startPos: number,
      endPos: number,
    ) => {
      const lineSelector = `.jl-${item.id}`;
      const dotSelector = `.jd-${item.id}`;
      const titleSelector = `.title-${item.id}`;
      const descriptionSelector = `.description-${item.id}`;

      if (!isTop) {
        gsap.set(lineSelector, { transformOrigin: "top top" });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: `${startPos}% 30%`,
          end: `${endPos}% 50%`,
          scrub: true,
        },
      });

      timeline
        .to(lineSelector, {
          scaleY: 1,
          duration: normalizedDuration * 0.4,
        })
        .to(
          dotSelector,
          {
            scale: 1,
            duration: normalizedDuration * 0.4,
          },
          "<",
        )
        .fromTo(
          titleSelector,
          { yPercent: 110 },
          {
            yPercent: 0,
            delay: -0.8 * normalizedDuration,
            duration: normalizedDuration,
            ease: "power2.out",
          },
        )
        .fromTo(
          descriptionSelector,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: normalizedDuration,
            ease: "power2.out",
          },
          "<+=0.1",
        );

      return timeline;
    };

    const positions = revealPositions(items.length, window.innerWidth < 600);

    items.forEach((item, index) => {
      const [startPos, endPos] = positions[index];
      createItemTimeline(item, index % 2 === 0, startPos, endPos);
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, { dependencies: [items, normalizedDuration, reducedMotion], scope: sectionRef });

  const renderCopy = (item: TimelineItem) => (
    <>
      <div className="overflow-hidden pb-[0.12em]">
        <h4
          className={`title-${item.id} text-[1.9vw] font-[550] leading-[1.05] tracking-[-0.04em] max-[600px]:text-[6vw]`}
        >
          <span className="mb-[.4vw] block text-[1vw] font-medium tracking-[0.2em] max-[600px]:mb-[1.5vw] max-[600px]:text-[3.4vw]" style={labelStyle}>
            {item.label}
          </span>
          {item.title}
        </h4>
      </div>
      <div className="overflow-hidden pb-[0.12em]">
        <p
          className={`description-${item.id} w-[90%] text-[1.15vw] leading-[1.3] max-[600px]:w-[95%] max-[600px]:text-[4vw]`}
          style={mutedTextStyle}
        >
          {item.content}
        </p>
      </div>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`h-[180vw] max-[600px]:h-[400vh] w-full relative ${className}`}
      style={sectionStyle}
    >
      <div className="h-screen w-full sticky top-[0%] pt-[max(124px,8.5vw)] overflow-hidden max-[600px]:pt-[36vw]">
        <div
          ref={wholeSliderRef}
          className="mr-[2vw] flex h-[min(27vw,calc(100vh-245px))] w-[200vw] items-center gap-[5vw] px-[5vw] max-[600px]:h-[58vh] max-[600px]:w-[480vw] max-[600px]:px-[7vw]"
        >
          {imageUrl && (
            <div className="journey-intro h-full w-[30vw] shrink-0 overflow-hidden rounded-[1vw] max-[600px]:h-[65vw] max-[600px]:w-[85vw] max-[600px]:rounded-[5vw]">
              <img
                src={imageUrl}
                alt={imageAlt}
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="relative h-full w-full">
            <div className="w-full absolute left-0 top-[49%] -translate-y-1/2 flex items-center h-fit">
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] shrink-0 rounded-full"
                style={activeStyle}
              ></div>
              <div
                className="h-px w-[0%] rounded-full journey-line"
                style={activeStyle}
              ></div>
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] shrink-0 rounded-full"
                style={activeStyle}
              ></div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] shrink-0 pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <h2 className="journey-intro w-[90%] text-[2.6vw] leading-[0.95] max-[600px]:text-[8vw]">
                  {title}
                </h2>
              </div>

              <div className="w-full flex h-full gap-x-[15vw] max-[600px]:gap-x-[40vw]">
                {topItems.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[30vw] shrink-0 px-[3vw] max-[600px]:flex max-[600px]:w-[70vw] max-[600px]:flex-col max-[600px]:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-0 top-0 h-full">
                      <div
                        className={`size-[1vw] max-[600px]:size-[2.5vw] translate-x-[-50%] relative aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`h-[94%] w-px origin-bottom rounded-full jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="mt-[-1vw] space-y-[1vw] max-[600px]:mt-[-2vw] max-[600px]:space-y-[3vw]">
                      {renderCopy(item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-1/2 flex items-center justify-start w-full">
              <div className="w-[34%] shrink-0 pt-[2vw] max-[600px]:pt-[5vw] max-[600px]:w-[30%] h-full">
                <div
                  className="journey-intro w-[70%] text-[1.2vw] leading-[1.3] max-[600px]:w-[90%] max-[600px]:text-[3.8vw]"
                  style={mutedTextStyle}
                >
                  {aside}
                </div>
              </div>

              <div className="w-full flex h-full gap-x-[17vw] ml-[7vw] max-[600px]:gap-x-[40vw] max-[600px]:ml-[7vw]">
                {bottomItems.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[28vw] shrink-0 px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-[-1%] h-full">
                      <div
                        className={`h-[94%] origin-top w-px rounded-full max-[600px]:h-full jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`size-[1vw] max-[600px]:size-[2.5vw] translate-x-[-50%] relative w-auto aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="flex h-full w-full flex-col justify-end space-y-[1vw] max-[600px]:space-y-[3vw]">
                      {renderCopy(item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {action && (
          <div className="journey-intro mt-[2.5vw] flex justify-center px-4 max-[600px]:mt-[6vw]">
            {action}
          </div>
        )}
      </div>
    </section>
  );
}
