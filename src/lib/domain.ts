// Shared domain constants for the Writer's Studio app.

export const BOOK_TYPES = [
  "Novel",
  "Komik",
  "Film",
  "Game",
  "Lainnya",
] as const;
export type BookType = (typeof BOOK_TYPES)[number];

export const BOOK_STATUSES = [
  "draft",
  "writing",
  "editing",
  "done",
] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

export const BOOK_STATUS_LABEL: Record<BookStatus, string> = {
  draft: "Draf",
  writing: "Menulis",
  editing: "Revisi",
  done: "Selesai",
};

// Accent color keys mapped to tailwind-friendly classes in the UI.
export const BOOK_ACCENTS = [
  "amber",
  "rose",
  "emerald",
  "violet",
  "sky",
  "orange",
  "teal",
  "pink",
] as const;
export type BookAccent = (typeof BOOK_ACCENTS)[number];

export const PLOT_KINDS = [
  "act",
  "chapter",
  "scene",
  "beat",
  "note",
] as const;
export type PlotKind = (typeof PLOT_KINDS)[number];
export const PLOT_KIND_LABEL: Record<PlotKind, string> = {
  act: "Adegan Besar",
  chapter: "Bab",
  scene: "Adegan",
  beat: "Beat",
  note: "Catatan",
};

export const WORLD_CATEGORIES = [
  "location",
  "culture",
  "history",
  "magic",
  "tech",
  "religion",
  "geography",
  "lore",
  "other",
] as const;
export type WorldCategory = (typeof WORLD_CATEGORIES)[number];
export const WORLD_CATEGORY_LABEL: Record<WorldCategory, string> = {
  location: "Lokasi",
  culture: "Budaya",
  history: "Sejarah",
  magic: "Sistem Magis",
  tech: "Teknologi",
  religion: "Agama & Mitos",
  geography: "Geografi",
  lore: "Lore",
  other: "Lainnya",
};

export const WIKI_CATEGORIES = [
  "character",
  "item",
  "faction",
  "location",
  "event",
  "concept",
  "other",
] as const;
export type WikiCategory = (typeof WIKI_CATEGORIES)[number];
export const WIKI_CATEGORY_LABEL: Record<WikiCategory, string> = {
  character: "Karakter",
  item: "Item",
  faction: "Faksi",
  location: "Lokasi",
  event: "Peristiwa",
  concept: "Konsep",
  other: "Lainnya",
};
