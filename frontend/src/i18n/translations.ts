// UI translations (pt-BR default + en).
// Spanish is reserved for pedagogical content (examples, exercises, lexicon)
// and a few stylized brand flavor lines — never put plain UI strings in Spanish here.
//
// Strings live in /locales/{pt,en}.ts. Keep both shapes identical.

import { pt } from "./locales/pt";
import { en } from "./locales/en";

export type Locale = "pt" | "en";
export type Translations = typeof pt;

export const translations: Record<Locale, Translations> = {
  pt,
  // EN is structurally identical; cast keeps both branches compatible
  en: en as unknown as Translations,
};
