import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Stars } from "@/components/Stars";
import { useT } from "@/i18n/LanguageContext";

interface GameShellProps {
  title: string;
  subtitle?: string;
  backHref: string;
  stars?: number;
  progress?: { current: number; total: number };
  children: React.ReactNode;
}

export const GameShell = ({ title, subtitle, backHref, stars, progress, children }: GameShellProps) => {
  const t = useT();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-warm">
      <div className="container py-6 md:py-10">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Button asChild variant="ghost" size="icon" aria-label={t.jogos.shell.voltar}>
              <Link to={backHref}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="font-display text-xl md:text-2xl truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {progress && (
              <div className="text-sm font-semibold text-muted-foreground">
                {progress.current}/{progress.total}
              </div>
            )}
            {typeof stars === "number" && <Stars value={stars} size="sm" />}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
