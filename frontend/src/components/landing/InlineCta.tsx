import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

interface InlineCtaProps {
  label: string;
  subtext?: string;
  to?: string;
  variant?: "hero" | "spain" | "default";
  className?: string;
}

export const InlineCta = ({
  label,
  subtext,
  to = "/cadastro",
  variant = "hero",
  className,
}: InlineCtaProps) => {
  return (
    <section className={cn("container py-12 sm:py-16 md:py-20", className)}>
      <Reveal>
        <div className="flex flex-col items-center text-center gap-4">
          <Button asChild size="xl" variant={variant} className="group w-full sm:w-auto max-w-sm">
            <Link to={to}>
              {label}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          {subtext && (
            <p className="text-sm text-muted-foreground px-4">{subtext}</p>
          )}
        </div>
      </Reveal>
    </section>
  );
};
