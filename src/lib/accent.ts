import type { BookAccent } from "@/lib/domain";

// Static class maps so Tailwind can detect them at build time.
export const ACCENT_GRADIENT: Record<BookAccent, string> = {
  amber: "from-amber-500 to-orange-600",
  rose: "from-rose-500 to-pink-600",
  emerald: "from-emerald-500 to-teal-600",
  violet: "from-violet-500 to-purple-600",
  sky: "from-sky-500 to-cyan-600",
  orange: "from-orange-500 to-red-600",
  teal: "from-teal-500 to-emerald-600",
  pink: "from-pink-500 to-rose-600",
};

export const ACCENT_SOLID: Record<BookAccent, string> = {
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  sky: "bg-sky-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  pink: "bg-pink-500",
};

export const ACCENT_RING: Record<BookAccent, string> = {
  amber: "ring-amber-500/40",
  rose: "ring-rose-500/40",
  emerald: "ring-emerald-500/40",
  violet: "ring-violet-500/40",
  sky: "ring-sky-500/40",
  orange: "ring-orange-500/40",
  teal: "ring-teal-500/40",
  pink: "ring-pink-500/40",
};

export const ACCENT_TEXT: Record<BookAccent, string> = {
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  violet: "text-violet-600 dark:text-violet-400",
  sky: "text-sky-600 dark:text-sky-400",
  orange: "text-orange-600 dark:text-orange-400",
  teal: "text-teal-600 dark:text-teal-400",
  pink: "text-pink-600 dark:text-pink-400",
};

export const ACCENT_DOT: Record<BookAccent, string> = {
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  sky: "bg-sky-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  pink: "bg-pink-500",
};
