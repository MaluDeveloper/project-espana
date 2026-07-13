import { motion } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const t = useT();
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={(definition) => {
        if (
          typeof definition === "object" &&
          definition !== null &&
          "y" in definition &&
          (definition as { y: string }).y === "-100%"
        ) {
          onComplete();
        }
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-navy text-navy-foreground overflow-hidden"
    >
      {/* Ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display font-extrabold tracking-tight text-5xl sm:text-6xl md:text-7xl text-white"
        >
          Spanish AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm sm:text-base md:text-lg text-navy-foreground/75 font-medium tracking-wide"
        >
          {t.preloader.tagline}
        </motion.p>
      </div>
    </motion.div>
  );
};
