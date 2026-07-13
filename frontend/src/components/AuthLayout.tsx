import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SpanishLogo } from "@/components/SpanishLogo";
import { useT } from "@/i18n/LanguageContext";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  const t = useT();
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col px-6 py-8 md:px-12">
        <Link to="/" aria-label="Home">
          <SpanishLogo />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex items-center"
        >
          <div className="w-full max-w-md mx-auto">
            <h1 className="font-display text-3xl md:text-4xl mb-2">{title}</h1>
            <p className="text-muted-foreground mb-8">{subtitle}</p>
            {children}
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex relative bg-gradient-spain items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
        <div aria-hidden className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-secondary/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary-glow/40 blur-3xl" />

        <div className="relative text-center px-12">
          <h2 className="font-display text-4xl text-primary-foreground mb-4 leading-tight">
            {t.auth.layout.title}
            <br /> {t.auth.layout.title2}
          </h2>
          <p className="text-primary-foreground/90 text-lg max-w-sm mx-auto">
            {t.auth.layout.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
