import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

gsap.registerPlugin(ScrollTrigger);

interface AnimationOrderItem {
  segment: HTMLElement;
  originalIndex: number;
}

export interface ScrollAnimationImage {
  src: string;
  alt: string;
}

export interface HomeHeroLandingScrollAnimationProps {
  images: ScrollAnimationImage[];
  /** Text shown after the images settle. Each image lands between two consecutive segments,
   *  so pass images.length + 1 segments. */
  segments: string[];
}

const BG = "hsl(var(--background))";

const HomeHeroLandingScrollAnimation = ({ images, segments }: HomeHeroLandingScrollAnimationProps) => {
  const animatedIconsRef = useRef<HTMLDivElement | null>(null);
  const heroHeaderRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const iconElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textSegmentsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const placeholdersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const duplicateIconsRef = useRef<HTMLElement[] | null>(null);
  const textAnimationOrderRef = useRef<AnimationOrderItem[]>([]);

  useEffect(() => {
    const textSegments = textSegmentsRef.current;
    const animationOrder: AnimationOrderItem[] = [];

    textSegments.forEach((segment, index) => {
      if (segment) animationOrder.push({ segment, originalIndex: index });
    });

    for (let i = animationOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [animationOrder[i], animationOrder[j]] = [animationOrder[j], animationOrder[i]];
    }

    textAnimationOrderRef.current = animationOrder;

    const isMobile = window.innerWidth < 1000;
    const headerIconSize = isMobile ? 35 : 60;
    const currentIconSize = iconElementsRef.current[0]?.getBoundingClientRect().width || 1;
    const exactScale = headerIconSize / currentIconSize;

    const removeDuplicates = () => {
      duplicateIconsRef.current?.forEach((d) => d.parentNode?.removeChild(d));
      duplicateIconsRef.current = null;
    };

    const trigger = ScrollTrigger.create({
      trigger: heroSectionRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 8}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      // Scrolling back above the section must not leave the cloned thumbnails floating on the page.
      onLeaveBack: removeDuplicates,
      onUpdate: (self) => {
        const progress = self.progress;

        textSegments.forEach((segment) => {
          if (segment) gsap.set(segment, { opacity: 0 });
        });

        if (progress < 0.3) {
          const moveProgress = progress / 0.3;
          const containerMoveY = -window.innerHeight * 0.3 * moveProgress;

          if (progress < 0.15) {
            const headerProgress = progress / 0.15;
            gsap.set(heroHeaderRef.current, {
              transform: `translateY(${-50 * headerProgress}px)`,
              opacity: 1 - headerProgress,
            });
          } else {
            gsap.set(heroHeaderRef.current, { transform: "translateY(-50px)", opacity: 0 });
          }

          removeDuplicates();

          gsap.set(animatedIconsRef.current, { x: 0, y: containerMoveY, scale: 1, opacity: 1 });

          iconElementsRef.current.forEach((icon, index) => {
            if (icon) {
              const staggerDelay = index * 0.1;
              const iconProgress = gsap.utils.mapRange(staggerDelay, staggerDelay + 0.5, 0, 1, moveProgress);
              const clamped = Math.max(0, Math.min(1, iconProgress));
              gsap.set(icon, { x: 0, y: (-containerMoveY) * (1 - clamped) });
            }
          });

        } else if (progress < 0.6) {
          const scaleProgress = (progress - 0.3) / 0.3;

          gsap.set(heroHeaderRef.current, { transform: "translateY(-50px)", opacity: 0 });
          if (heroSectionRef.current) heroSectionRef.current.style.backgroundColor = BG;

          removeDuplicates();

          const containerRect = animatedIconsRef.current!.getBoundingClientRect();
          const deltaX = (window.innerWidth / 2 - (containerRect.left + containerRect.width / 2)) * scaleProgress;
          const deltaY = (window.innerHeight / 2 - (containerRect.top + containerRect.height / 2)) * scaleProgress;

          gsap.set(animatedIconsRef.current, {
            x: deltaX,
            y: -window.innerHeight * 0.3 + deltaY,
            scale: 1 + (exactScale - 1) * scaleProgress,
            opacity: 1,
          });

          iconElementsRef.current.forEach((icon) => { if (icon) gsap.set(icon, { x: 0, y: 0 }); });

        } else if (progress < 0.75) {
          const moveProgress = (progress - 0.6) / 0.15;

          gsap.set(heroHeaderRef.current, { transform: "translateY(-50px)", opacity: 0 });
          if (heroSectionRef.current) heroSectionRef.current.style.backgroundColor = BG;

          const containerRect = animatedIconsRef.current!.getBoundingClientRect();
          const deltaX = window.innerWidth / 2 - (containerRect.left + containerRect.width / 2);
          const deltaY = window.innerHeight / 2 - (containerRect.top + containerRect.height / 2);

          gsap.set(animatedIconsRef.current, {
            x: deltaX,
            y: -window.innerHeight * 0.3 + deltaY,
            scale: exactScale,
            opacity: 0,
          });

          iconElementsRef.current.forEach((icon) => { if (icon) gsap.set(icon, { x: 0, y: 0 }); });

          if (!duplicateIconsRef.current) {
            duplicateIconsRef.current = [];
            iconElementsRef.current.forEach((icon) => {
              if (icon) {
                const duplicate = icon.cloneNode(true) as HTMLElement;
                duplicate.className = "duplicate-icon rounded-sm overflow-hidden";
                Object.assign(duplicate.style, {
                  position: "absolute",
                  width: headerIconSize + "px",
                  height: headerIconSize + "px",
                  zIndex: "40",
                  pointerEvents: "none",
                });
                heroSectionRef.current!.appendChild(duplicate);
                duplicateIconsRef.current!.push(duplicate);
              }
            });
          }

          // Clones live inside the pinned section, so section-relative coordinates stay put while the
          // page scrolls; page coordinates lagged behind the scrubbed update and made them shake.
          const sectionRect = heroSectionRef.current!.getBoundingClientRect();
          duplicateIconsRef.current?.forEach((duplicate, index) => {
            if (index < placeholdersRef.current.length) {
              const iconRect = iconElementsRef.current[index]!.getBoundingClientRect();
              const startX = iconRect.left + iconRect.width / 2 - sectionRect.left;
              const startY = iconRect.top + iconRect.height / 2 - sectionRect.top;

              const targetRect = placeholdersRef.current[index]!.getBoundingClientRect();
              const targetX = targetRect.left + targetRect.width / 2 - sectionRect.left;
              const targetY = targetRect.top + targetRect.height / 2 - sectionRect.top;

              const moveX = targetX - startX;
              const moveY = targetY - startY;

              let currentX = 0;
              const currentY = moveProgress < 0.5 ? moveY * (moveProgress / 0.5) : moveY;
              if (moveProgress >= 0.5) currentX = moveX * ((moveProgress - 0.5) / 0.5);

              duplicate.style.left = startX + currentX - headerIconSize / 2 + "px";
              duplicate.style.top = startY + currentY - headerIconSize / 2 + "px";
              duplicate.style.opacity = "1";
              duplicate.style.display = "flex";
            }
          });

        } else {
          gsap.set(heroHeaderRef.current, { transform: "translateY(-100px)", opacity: 0 });
          if (heroSectionRef.current) heroSectionRef.current.style.backgroundColor = BG;
          gsap.set(animatedIconsRef.current, { opacity: 0 });

          const sectionRect = heroSectionRef.current!.getBoundingClientRect();

          duplicateIconsRef.current?.forEach((duplicate, index) => {
            if (index < placeholdersRef.current.length) {
              const targetRect = placeholdersRef.current[index]!.getBoundingClientRect();
              const targetX = targetRect.left + targetRect.width / 2 - sectionRect.left;
              const targetY = targetRect.top + targetRect.height / 2 - sectionRect.top;
              duplicate.style.left = targetX - headerIconSize / 2 + "px";
              duplicate.style.top = targetY - headerIconSize / 2 + "px";
              duplicate.style.opacity = "1";
              duplicate.style.display = "flex";
            }
          });

          textAnimationOrderRef.current.forEach((item, randomIndex) => {
            const segStart = 0.75 + randomIndex * 0.03;
            const segProgress = gsap.utils.mapRange(segStart, segStart + 0.015, 0, 1, progress);
            gsap.set(item.segment, { opacity: Math.max(0, Math.min(1, segProgress)) });
          });
        }
      },
    });

    // This section sits mid-page: content above it (preloader, images, other sections) changes height
    // after mount, so the pin's start/end must be recomputed whenever the page height changes.
    let raf = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(document.body);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      trigger.kill();
      removeDuplicates();
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-background">
      <style>{`
        .hero-bg-swiper { position: absolute; inset: 0; width: 100% !important; height: 100% !important; }
        .hero-bg-swiper .swiper-wrapper, .hero-bg-swiper .swiper-slide { width: 100% !important; height: 100% !important; }
        .hero-bg-swiper .swiper-slide { opacity: 0 !important; transition: opacity 1.2s ease !important; }
        .hero-bg-swiper .swiper-slide-active { opacity: 1 !important; }
      `}</style>

      <section
        ref={heroSectionRef}
        className="relative w-full h-screen px-4 md:px-6 flex flex-col items-center justify-center bg-background text-[#2a160b] overflow-hidden"
        style={{ fontFamily: "'Orbit DM Sans', sans-serif" }}
      >
        <div
          ref={heroHeaderRef}
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ zIndex: 0 }}
        >
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            loop
            speed={1200}
            className="hero-bg-swiper"
          >
            {images.map((image) => (
              <SwiperSlide key={image.src} style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", inset: 0, zIndex: 1,
                  background: "linear-gradient(to bottom, rgba(250,250,250,0.52) 0%, rgba(250,250,250,0.28) 45%, rgba(250,250,250,0.78) 100%)",
                }} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* absolute (not fixed): the section is mid-page, so a fixed strip would float over the rest of the landing */}
        <div
          ref={animatedIconsRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-[9.25rem] md:translate-x-0 flex items-center gap-1 w-[90%] md:w-[80%] will-change-transform z-[2]"
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              ref={(el) => { iconElementsRef.current[index] = el; }}
              className="flex-1 aspect-square will-change-transform rounded-sm overflow-hidden bg-muted"
            >
              <img src={image.src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <h2 className="relative z-10 max-w-[90vw] md:max-w-[85vw] text-center text-[clamp(1.4rem,5vw,4.5rem)] font-[550] tracking-[-0.064em] leading-[1.3] md:leading-[1.2]">
          {segments.map((segment, index) => (
            <span key={index}>
              <span ref={(el) => { textSegmentsRef.current[index] = el; }} className="opacity-0">
                {segment}
              </span>
              {index < images.length && (
                <span
                  ref={(el) => { placeholdersRef.current[index] = el; }}
                  aria-hidden="true"
                  className="mx-1 md:-mt-1.5 w-8 h-8 md:w-16 md:h-16 inline-block align-middle invisible"
                />
              )}{" "}
            </span>
          ))}
        </h2>
      </section>
    </div>
  );
};

export default HomeHeroLandingScrollAnimation;
