import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** Light variant for use over dark backgrounds (e.g. transparent navbar). */
  light?: boolean;
  /** Show only the globe icon (no flag/short label). */
  iconOnly?: boolean;
  className?: string;
}

const options = [
  { value: "pt" as const, label: "Português", short: "PT", flag: "🇧🇷" },
  { value: "en" as const, label: "English", short: "EN", flag: "🇺🇸" },
];

export const LanguageSwitcher = ({ light = false, iconOnly = false, className }: LanguageSwitcherProps) => {
  const { locale, setLocale, t } = useLanguage();
  const current = options.find((o) => o.value === locale) ?? options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.nav.idioma}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          iconOnly ? "p-2 justify-center" : "px-2.5 py-1.5",
          light
            ? "text-white/90 hover:text-white hover:bg-white/10"
            : "text-foreground/80 hover:text-foreground hover:bg-accent/60",
          className,
        )}
      >
        <Globe className="w-4 h-4 opacity-80" />
        {!iconOnly && <span>{current.label}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {options.map((o) => {
          const active = o.value === locale;
          return (
            <DropdownMenuItem
              key={o.value}
              onClick={() => setLocale(o.value)}
              className={cn(
                "gap-2 cursor-pointer",
                active && "font-semibold",
              )}
            >
              <span aria-hidden className="text-base leading-none">
                {o.flag}
              </span>
              <span className="flex-1">{o.label}</span>
              {active && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
