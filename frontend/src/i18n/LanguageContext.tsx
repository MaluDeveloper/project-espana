import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { translations, type Locale, type Translations } from "./translations";

const STORAGE_KEY = "spanish-ai-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const detectInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "pt";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    // ignore
  }
  const nav = window.navigator?.language?.toLowerCase() ?? "pt";
  if (nav.startsWith("pt")) return "pt";
  if (nav.startsWith("en")) return "en";
  return "pt";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>("pt");

  // Hydrate after mount to avoid SSR mismatch
  useEffect(() => {
    setLocaleState(detectInitialLocale());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale, setLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const useT = () => useLanguage().t;
