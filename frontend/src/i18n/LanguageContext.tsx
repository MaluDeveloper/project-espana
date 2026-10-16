// UI strings. The site is Portuguese-only (pt-BR); Spanish is reserved for the
// course content itself. Strings stay centralized in ./locales/pt.ts so components
// never hardcode copy.
import { pt } from "./locales/pt";

export type Translations = typeof pt;

const value = { t: pt };

export const useLanguage = () => value;

export const useT = () => pt;
