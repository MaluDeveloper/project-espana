// Stacked drag carousel (21st.dev "carousel-07"). Adapted: slides come in as props,
// motion comes from framer-motion (same API as motion/react), Tailwind 4 classes
// are swapped for Tailwind 3 ones, and prev/next buttons drive it besides dragging.

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface CarouselSlide {
  image: string;
  title: string;
  description: string;
  badge: string;
}

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 90,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};

const spring = { type: "spring", stiffness: 200, damping: 30, mass: 1 } as const;

interface CarouselStackedProps {
  slides: readonly CarouselSlide[];
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
  /** Classes for the badge, e.g. to match the page's label style. */
  badgeClassName?: string;
  /** Classes for the slide title, e.g. to match the page's heading weight. */
  titleClassName?: string;
}

const CarouselStacked = ({
  slides,
  prevLabel = "Previous",
  nextLabel = "Next",
  className,
  badgeClassName,
  titleClassName,
}: CarouselStackedProps) => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);

  const total = slides.length;

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config = React.useMemo(
    () => getCarouselConfig(windowWidth),
    [windowWidth],
  );

  const handleDragStart = () => {
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, spring);
  };

  const step = (direction: 1 | -1) => {
    animate(scrollProgress, Math.round(scrollProgress.get()) + direction, spring);
  };

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className={cn("flex flex-col items-center justify-center w-full py-10 overflow-hidden select-none", className)}>
      <div className="relative w-full max-w-7xl h-80 sm:h-[28rem] lg:h-[32rem] flex items-center justify-center">
        {/* Transparent Drag Surface */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            const delta = -info.delta.x / config.sensitivity;
            scrollProgress.set(scrollProgress.get() + delta);
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-[200] cursor-grab active:cursor-grabbing"
        />

        {slides.map((slide, i) => (
          <Card
            key={slide.title}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
            badgeClassName={badgeClassName}
            titleClassName={titleClassName}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={() => step(-1)} aria-label={prevLabel} className={arrowClass}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label={nextLabel} className={arrowClass}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

interface CardProps {
  slide: CarouselSlide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
  badgeClassName?: string;
  titleClassName?: string;
}

const Card = ({ slide, index, total, progress, config, badgeClassName, titleClassName }: CardProps) => {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction,
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) =>
    Math.round(100 - Math.abs(o) * 10),
  );
  const shade = useTransform(
    offset,
    [-2, -0.5, 0, 0.5, 2],
    [0.5, 0.2, 0, 0.2, 0.5],
  );
  const copyOpacity = useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]);

  return (
    <motion.div
      style={{
        x,
        rotate,
        y,
        scale,
        opacity,
        zIndex,
      }}
      className={cn(
        "absolute rounded-2xl overflow-hidden bg-muted pointer-events-none shadow-elevated",
        "w-44 h-56 sm:w-56 sm:h-80 lg:w-64 lg:h-96",
      )}
    >
      <img
        src={slide.image}
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      <motion.div
        style={{ opacity: shade }}
        className="absolute inset-0 bg-black pointer-events-none"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <Badge
        className={cn(
          "absolute top-3 right-3 sm:top-5 sm:right-5 lg:top-6 lg:right-6 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-black hover:bg-white/95",
          badgeClassName,
        )}
      >
        {slide.badge}
      </Badge>

      <div className="absolute bottom-5 left-3 right-3 sm:bottom-8 sm:left-5 sm:right-5 lg:bottom-10 lg:left-6 lg:right-6 text-white text-center sm:text-left">
        <motion.p
          style={{ opacity: copyOpacity }}
          className={cn(
            "text-sm sm:text-lg lg:text-xl font-bold leading-tight mb-0.5 sm:mb-1 drop-shadow-md",
            titleClassName,
          )}
        >
          {slide.title}
        </motion.p>
        <motion.p
          style={{ opacity: copyOpacity }}
          className="hidden sm:block text-xs text-white/75 line-clamp-2 font-medium"
        >
          {slide.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CarouselStacked;
