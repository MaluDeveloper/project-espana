// Spanish AI — Catálogo de jogos, níveis e conteúdo mockado.
// Tudo aqui é frontend-only e pode ser substituído por API/IA depois.

import {
  Brain,
  Search,
  Grid3x3,
  BookOpen,
  Eye,
  PencilLine,
  ImageIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type LevelId = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const LEVELS: { id: LevelId; label: string; tier: "iniciante" | "intermedio" | "avanzado" }[] = [
  { id: "A1", label: "Principiante", tier: "iniciante" },
  { id: "A2", label: "Básico", tier: "iniciante" },
  { id: "B1", label: "Intermedio", tier: "intermedio" },
  { id: "B2", label: "Intermedio alto", tier: "intermedio" },
  { id: "C1", label: "Avanzado", tier: "avanzado" },
  { id: "C2", label: "Maestría", tier: "avanzado" },
];

export type GameCategoryId =
  | "memoria"
  | "caza-palabras"
  | "crucigrama"
  | "lacunas"
  | "historias"
  | "objetos"
  | "describir"
  | "crear-historia";

export interface GameCategory {
  id: GameCategoryId;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: "primary" | "secondary" | "success";
  available: boolean;
  totalStages: number;
}

export const GAME_CATEGORIES: GameCategory[] = [
  {
    id: "memoria",
    title: "Juego de memoria",
    tagline: "Empareja palabra y traducción",
    description: "Encuentra los pares de cartas escondidas. Entrena vocabulario rápido.",
    icon: Brain,
    accent: "primary",
    available: true,
    totalStages: 50,
  },
  {
    id: "caza-palabras",
    title: "Caza-palabras",
    tagline: "Encuentra palabras en la sopa",
    description: "Sopa de letras temática. Encuentra todas las palabras antes que se acabe el tiempo.",
    icon: Search,
    accent: "secondary",
    available: true,
    totalStages: 20,
  },
  {
    id: "lacunas",
    title: "Completar huecos",
    tagline: "Frases con palabras faltantes",
    description: "Elige la palabra correcta para completar la frase. Gramática en contexto.",
    icon: PencilLine,
    accent: "success",
    available: true,
    totalStages: 25,
  },
  {
    id: "crucigrama",
    title: "Crucigrama",
    tagline: "Pistas y palabras cruzadas",
    description: "Resuelve definiciones y completa la cuadrícula. Próximamente.",
    icon: Grid3x3,
    accent: "primary",
    available: false,
    totalStages: 15,
  },
  {
    id: "historias",
    title: "Leer historias",
    tagline: "Comprensión lectora",
    description: "Cuentos cortos con preguntas. Aprende leyendo. Próximamente.",
    icon: BookOpen,
    accent: "secondary",
    available: false,
    totalStages: 18,
  },
  {
    id: "objetos",
    title: "Encuentra objetos",
    tagline: "Busca en la imagen",
    description: "Localiza objetos en escenas reales. Vocabulario visual. Próximamente.",
    icon: Eye,
    accent: "success",
    available: false,
    totalStages: 12,
  },
  {
    id: "describir",
    title: "Describir imágenes",
    tagline: "Escribe lo que ves",
    description: "La IA evalúa tu descripción. Próximamente.",
    icon: ImageIcon,
    accent: "primary",
    available: false,
    totalStages: 14,
  },
  {
    id: "crear-historia",
    title: "Crear historias",
    tagline: "Escribe con palabras dadas",
    description: "La IA te da palabras y tú creas la historia. Próximamente.",
    icon: Sparkles,
    accent: "secondary",
    available: false,
    totalStages: 16,
  },
];

export const getCategory = (id: string): GameCategory | undefined =>
  GAME_CATEGORIES.find((c) => c.id === id);

// ─────────────────────────────────────────────────────────────
// VOCABULARY POOLS — palavra, tradução, tema
// ─────────────────────────────────────────────────────────────
export interface VocabPair {
  es: string;
  pt: string;
  en: string;
}

export interface ThemePool {
  theme: string;
  themeEn?: string;
  level: LevelId;
  words: VocabPair[];
}

export const VOCAB_POOLS: ThemePool[] = [
  {
    theme: "El mercado",
    themeEn: "The market",
    level: "A1",
    words: [
      { es: "manzana", pt: "maçã", en: "apple" },
      { es: "pan", pt: "pão", en: "bread" },
      { es: "queso", pt: "queijo", en: "cheese" },
      { es: "leche", pt: "leite", en: "milk" },
      { es: "tomate", pt: "tomate", en: "tomato" },
      { es: "huevo", pt: "ovo", en: "egg" },
      { es: "agua", pt: "água", en: "water" },
      { es: "carne", pt: "carne", en: "meat" },
    ],
  },
  {
    theme: "La casa",
    themeEn: "The house",
    level: "A1",
    words: [
      { es: "puerta", pt: "porta", en: "door" },
      { es: "ventana", pt: "janela", en: "window" },
      { es: "cama", pt: "cama", en: "bed" },
      { es: "mesa", pt: "mesa", en: "table" },
      { es: "silla", pt: "cadeira", en: "chair" },
      { es: "cocina", pt: "cozinha", en: "kitchen" },
      { es: "baño", pt: "banheiro", en: "bathroom" },
      { es: "llave", pt: "chave", en: "key" },
    ],
  },
  {
    theme: "La playa",
    themeEn: "The beach",
    level: "A2",
    words: [
      { es: "arena", pt: "areia", en: "sand" },
      { es: "ola", pt: "onda", en: "wave" },
      { es: "sombrilla", pt: "guarda-sol", en: "beach umbrella" },
      { es: "toalla", pt: "toalha", en: "towel" },
      { es: "concha", pt: "concha", en: "shell" },
      { es: "barco", pt: "barco", en: "boat" },
      { es: "sol", pt: "sol", en: "sun" },
      { es: "mar", pt: "mar", en: "sea" },
    ],
  },
  {
    theme: "La ciudad",
    themeEn: "The city",
    level: "A2",
    words: [
      { es: "calle", pt: "rua", en: "street" },
      { es: "plaza", pt: "praça", en: "square" },
      { es: "tienda", pt: "loja", en: "shop" },
      { es: "metro", pt: "metrô", en: "subway" },
      { es: "semáforo", pt: "semáforo", en: "traffic light" },
      { es: "edificio", pt: "edifício", en: "building" },
      { es: "parque", pt: "parque", en: "park" },
      { es: "puente", pt: "ponte", en: "bridge" },
    ],
  },
  {
    theme: "La cocina",
    themeEn: "The kitchen",
    level: "B1",
    words: [
      { es: "cuchillo", pt: "faca", en: "knife" },
      { es: "sartén", pt: "frigideira", en: "frying pan" },
      { es: "olla", pt: "panela", en: "pot" },
      { es: "horno", pt: "forno", en: "oven" },
      { es: "nevera", pt: "geladeira", en: "fridge" },
      { es: "cuchara", pt: "colher", en: "spoon" },
      { es: "plato", pt: "prato", en: "plate" },
      { es: "tenedor", pt: "garfo", en: "fork" },
    ],
  },
  {
    theme: "Trabajo y oficina",
    themeEn: "Work and office",
    level: "B1",
    words: [
      { es: "reunión", pt: "reunião", en: "meeting" },
      { es: "jefe", pt: "chefe", en: "boss" },
      { es: "sueldo", pt: "salário", en: "salary" },
      { es: "informe", pt: "relatório", en: "report" },
      { es: "horario", pt: "horário", en: "schedule" },
      { es: "correo", pt: "e-mail", en: "email" },
      { es: "empresa", pt: "empresa", en: "company" },
      { es: "plazo", pt: "prazo", en: "deadline" },
    ],
  },
  {
    theme: "Naturaleza",
    themeEn: "Nature",
    level: "B2",
    words: [
      { es: "bosque", pt: "floresta", en: "forest" },
      { es: "río", pt: "rio", en: "river" },
      { es: "montaña", pt: "montanha", en: "mountain" },
      { es: "sendero", pt: "trilha", en: "trail" },
      { es: "cascada", pt: "cachoeira", en: "waterfall" },
      { es: "amanecer", pt: "amanhecer", en: "sunrise" },
      { es: "niebla", pt: "neblina", en: "fog" },
      { es: "ardilla", pt: "esquilo", en: "squirrel" },
    ],
  },
  {
    theme: "Sentimientos",
    themeEn: "Feelings",
    level: "C1",
    words: [
      { es: "anhelo", pt: "anseio", en: "longing" },
      { es: "rencor", pt: "rancor", en: "resentment" },
      { es: "asombro", pt: "espanto", en: "astonishment" },
      { es: "nostalgia", pt: "nostalgia", en: "nostalgia" },
      { es: "orgullo", pt: "orgulho", en: "pride" },
      { es: "ternura", pt: "ternura", en: "tenderness" },
      { es: "desazón", pt: "inquietação", en: "unease" },
      { es: "júbilo", pt: "júbilo", en: "jubilation" },
    ],
  },
];

export const poolsByLevel = (level: LevelId): ThemePool[] =>
  VOCAB_POOLS.filter((p) => p.level === level);

export const translatePair = (pair: VocabPair, locale: "pt" | "en"): string =>
  locale === "en" ? pair.en : pair.pt;

export const translateTheme = (pool: ThemePool, locale: "pt" | "en"): string =>
  locale === "en" && pool.themeEn ? pool.themeEn : pool.theme;

// ─────────────────────────────────────────────────────────────
// FRASES PARA HUECOS
// ─────────────────────────────────────────────────────────────
export interface GapSentence {
  before: string;
  after: string;
  answer: string;
  options: string[];
  hint?: string;
}

export const GAP_BANK: Record<LevelId, GapSentence[]> = {
  A1: [
    { before: "Yo ", after: " estudiante.", answer: "soy", options: ["soy", "eres", "es", "somos"] },
    { before: "Ella ", after: " en Madrid.", answer: "vive", options: ["vivo", "vives", "vive", "viven"] },
    { before: "Nosotros ", after: " agua.", answer: "bebemos", options: ["bebo", "bebes", "bebemos", "beben"] },
    { before: "El gato está ", after: " la mesa.", answer: "sobre", options: ["sobre", "entre", "sin", "para"] },
    { before: "¿", after: " te llamas?", answer: "Cómo", options: ["Qué", "Cómo", "Dónde", "Cuándo"] },
    { before: "Tengo ", after: " años.", answer: "veinte", options: ["veinte", "veinto", "veinta", "veintes"] },
  ],
  A2: [
    { before: "Ayer ", after: " al cine.", answer: "fui", options: ["voy", "fui", "iré", "iba"] },
    { before: "Si tengo tiempo, ", after: " contigo.", answer: "iré", options: ["voy", "fui", "iré", "iba"] },
    { before: "El libro ", after: " sobre la mesa.", answer: "está", options: ["es", "está", "hay", "son"] },
    { before: "Me ", after: " la paella.", answer: "gusta", options: ["gusto", "gusta", "gustan", "gustas"] },
    { before: "Hace mucho ", after: " hoy.", answer: "calor", options: ["calor", "frío", "viento", "lluvia"], hint: "Verano en España" },
  ],
  B1: [
    { before: "Cuando era niño, ", after: " mucho.", answer: "jugaba", options: ["jugué", "jugaba", "juego", "jugaré"] },
    { before: "Espero que ", after: " bien el examen.", answer: "salga", options: ["sale", "salga", "salió", "saldrá"] },
    { before: "He ", after: " toda la novela.", answer: "leído", options: ["leer", "leyendo", "leído", "leía"] },
    { before: "No creo que ", after: " razón.", answer: "tengas", options: ["tienes", "tengas", "tuviste", "tendrás"] },
  ],
  B2: [
    { before: "Si ", after: " sabido, no habría venido.", answer: "hubiera", options: ["había", "hubiera", "habré", "habría"] },
    { before: "Por más que lo ", after: ", no lo entiendo.", answer: "intente", options: ["intento", "intenté", "intente", "intentaré"] },
    { before: "Aunque ", after: ", saldremos a caminar.", answer: "llueva", options: ["llueve", "llovió", "llueva", "lloverá"] },
  ],
  C1: [
    { before: "De haberlo ", after: ", te habría avisado.", answer: "sabido", options: ["sabido", "sabiendo", "sabe", "sabré"] },
    { before: "Por mucho que se ", after: ", no logrará convencerme.", answer: "esfuerce", options: ["esfuerza", "esforzó", "esfuerce", "esforzará"] },
    { before: "Ojalá ", after: " quedado un día más.", answer: "hubiera", options: ["había", "hubiera", "haya", "habría"] },
  ],
  C2: [
    { before: "Sea lo que ", after: ", lo aceptaré.", answer: "fuere", options: ["fuera", "fuere", "sería", "será"], hint: "Futuro de Subjuntivo" },
    { before: "Cuanto más lo ", after: ", menos lo entiendo.", answer: "pienso", options: ["pienso", "piense", "pensaba", "pensaré"] },
    { before: "De no ser por ti, ", after: " fracasado.", answer: "habría", options: ["había", "hubiera", "habré", "habría"] },
  ],
};

// ─────────────────────────────────────────────────────────────
// EMOJI por palavra (visual nos cards do jogo da memória)
// ─────────────────────────────────────────────────────────────
export const VOCAB_EMOJI: Record<string, string> = {
  manzana: "🍎", pan: "🍞", queso: "🧀", leche: "🥛", tomate: "🍅", huevo: "🥚", agua: "💧", carne: "🥩",
  puerta: "🚪", ventana: "🪟", cama: "🛏️", mesa: "🪞", silla: "🪑", cocina: "🍳", baño: "🛁", llave: "🔑",
  arena: "🏖️", ola: "🌊", sombrilla: "⛱️", toalla: "🧻", concha: "🐚", barco: "⛵", sol: "☀️", mar: "🌊",
  calle: "🛣️", plaza: "🏛️", tienda: "🏪", metro: "🚇", semáforo: "🚦", edificio: "🏢", parque: "🌳", puente: "🌉",
  cuchillo: "🔪", sartén: "🍳", olla: "🍲", horno: "🔥", nevera: "🧊", cuchara: "🥄", plato: "🍽️", tenedor: "🍴",
  reunión: "👥", jefe: "👔", sueldo: "💰", informe: "📊", horario: "🕐", correo: "📧", empresa: "🏢", plazo: "📅",
  bosque: "🌲", río: "🏞️", montaña: "⛰️", sendero: "🥾", cascada: "💦", amanecer: "🌅", niebla: "🌫️", ardilla: "🐿️",
  anhelo: "💭", rencor: "😠", asombro: "😲", nostalgia: "🥺", orgullo: "🦁", ternura: "🤗", desazón: "😟", júbilo: "🎉",
};

export const getEmoji = (es: string): string => VOCAB_EMOJI[es.toLowerCase()] ?? "✨";
