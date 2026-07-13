import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SpeechBubbleProps {
  children: ReactNode;
  /** Side where the speaker is, so the tail points toward them */
  tail?: "left" | "right" | "bottom-left" | "bottom-right" | "bottom-center";
  accent?: "primary" | "secondary";
  className?: string;
  delay?: number;
  label?: string;
}

/**
 * Oval speech bubble with a directional tail pointing toward the speaker.
 */
export const SpeechBubble = ({
  children,
  tail = "left",
  accent = "secondary",
  className,
  delay = 0,
  label,
}: SpeechBubbleProps) => {
  const accentRing =
    accent === "secondary"
      ? "ring-secondary/50 shadow-[0_8px_30px_-8px_hsl(var(--secondary)/0.35)]"
      : "ring-primary/40 shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.35)]";

  // Tail position + rotation. The tail is a small rounded triangle (rotated square)
  // that visually merges with the oval bubble.
  const tailPos: Record<NonNullable<SpeechBubbleProps["tail"]>, string> = {
    left: "-left-2 top-1/2 -translate-y-1/2",
    right: "-right-2 top-1/2 -translate-y-1/2",
    "bottom-left": "left-6 -bottom-2",
    "bottom-right": "right-6 -bottom-2",
    "bottom-center": "left-1/2 -translate-x-1/2 -bottom-2",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 180, damping: 16 }}
      className={cn(
        "relative bg-card text-card-foreground px-5 py-3 ring-2 ring-inset",
        // oval shape — pill on small bubbles, organic ellipse on larger ones
        "rounded-[50%/40%] md:rounded-[50%/45%]",
        accentRing,
        className
      )}
    >
      {label && (
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-0.5 text-center">
          {label}
        </div>
      )}
      <div className="font-bold text-sm md:text-[0.95rem] italic leading-snug text-center">
        {children}
      </div>

      {/* Tail */}
      <span
        aria-hidden
        className={cn(
          "absolute w-4 h-4 bg-card rotate-45 ring-2 ring-inset",
          accent === "secondary" ? "ring-secondary/50" : "ring-primary/40",
          tailPos[tail]
        )}
        style={{
          // Hide the inner edges so the tail merges with the bubble
          clipPath:
            tail === "left"
              ? "polygon(0 0, 100% 100%, 0 100%)"
              : tail === "right"
                ? "polygon(100% 0, 100% 100%, 0 100%)"
                : tail === "bottom-left"
                  ? "polygon(0 0, 100% 100%, 0 100%)"
                  : tail === "bottom-center"
                    ? "polygon(0 0, 100% 0, 100% 100%)"
                    : "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      />
    </motion.div>
  );
};
