import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** Horizontal start offset in px (negative = from the left). */
  x?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "header";
}

export const Reveal = ({ children, delay = 0, y = 24, x = 0, duration = 0.6, className, as = "div" }: RevealProps) => {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
};
