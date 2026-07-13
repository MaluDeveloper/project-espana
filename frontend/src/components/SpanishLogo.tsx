import { motion } from "framer-motion";

interface SpanishLogoProps {
  size?: number;
  withText?: boolean;
  light?: boolean;
}

export const SpanishLogo = ({ size = 36, withText = true, light = false }: SpanishLogoProps) => (
  <motion.div
    className="flex items-center gap-2.5"
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div
      className="relative rounded-2xl bg-gradient-spain shadow-card flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Marca: balão de conversa (idioma) + faísca (IA) */}
      <svg
        viewBox="0 0 48 48"
        width={size * 0.62}
        height={size * 0.62}
        className="relative z-10"
      >
        <rect x="6" y="8" width="32" height="22" rx="9" fill="white" />
        <path d="M14,28 L10,38 L22,29 Z" fill="white" />
        <circle cx="22" cy="13.5" r="2.3" fill="hsl(var(--primary))" />
        <path d="M22,17 L22,24" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M36,2 C37,7 39,9 44,10 C39,11 37,13 36,18 C35,13 33,11 28,10 C33,9 35,7 36,2 Z"
          fill="hsl(var(--secondary))"
        />
      </svg>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent to-white/20" />
    </div>
    {withText && (
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-extrabold text-lg tracking-tight transition-colors ${
            light ? "text-white" : "text-foreground"
          }`}
        >
          Spanish
          <span className={light ? "text-secondary" : "text-primary"}> AI</span>
        </span>
      </div>
    )}
  </motion.div>
);
