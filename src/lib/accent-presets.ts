// Accent color presets for the Fragilume app brand.
// Each preset defines oklch values for the brand-related CSS variables,
// for both light and dark themes. The AccentProvider injects these as a
// <style> tag so the existing `:root` / `.dark` cascade just works.

export type AccentKey =
  | "amber"
  | "rose"
  | "emerald"
  | "violet"
  | "sky"
  | "orange"
  | "teal"
  | "pink";

export type AccentTheme = {
  // Light theme values
  light: {
    brand: string;
    brandForeground: string;
    brandSoft: string;
    ring: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarRing: string;
    chart1: string;
    chart5: string;
  };
  // Dark theme values
  dark: {
    brand: string;
    brandForeground: string;
    brandSoft: string;
    ring: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarRing: string;
    chart1: string;
    chart5: string;
  };
};

// Shared foreground (dark text on the bright brand swatch) — readable
// across all hues because every brand color is light/bright.
const FG_DARK = "oklch(0.16 0.02 60)";
const FG_DARK_SIDEBAR = "oklch(0.16 0.02 60)";

function preset(hue: number, chroma = 0.16): AccentTheme {
  // Light: slightly muted, soft tint background.
  const lightBrand = `oklch(0.72 ${chroma} ${hue})`;
  const lightSoft = `oklch(0.95 ${Math.round(chroma * 26) / 100} ${hue})`;
  const lightRing = `oklch(0.75 ${Math.round(chroma * 83) / 100} ${hue})`;
  // Dark: a touch brighter so it pops on dark backgrounds.
  const darkBrand = `oklch(0.78 ${Math.round(chroma * 94) / 100} ${hue})`;
  const darkSoft = `oklch(0.3 ${Math.round(chroma * 33) / 100} ${hue})`;
  const darkRing = `oklch(0.78 ${Math.round(chroma * 88) / 100} ${hue})`;

  return {
    light: {
      brand: lightBrand,
      brandForeground: FG_DARK,
      brandSoft: lightSoft,
      ring: lightRing,
      sidebarPrimary: lightBrand,
      sidebarPrimaryForeground: FG_DARK_SIDEBAR,
      sidebarRing: lightRing,
      chart1: lightBrand,
      chart5: `oklch(0.76 ${chroma} ${hue})`,
    },
    dark: {
      brand: darkBrand,
      brandForeground: FG_DARK,
      brandSoft: darkSoft,
      ring: darkRing,
      sidebarPrimary: darkBrand,
      sidebarPrimaryForeground: FG_DARK_SIDEBAR,
      sidebarRing: darkRing,
      chart1: darkBrand,
      chart5: `oklch(0.78 ${chroma} ${hue})`,
    },
  };
}

export const ACCENT_PRESETS: Record<AccentKey, AccentTheme> = {
  amber: preset(63),
  rose: preset(15, 0.17),
  emerald: preset(160, 0.14),
  violet: preset(300, 0.17),
  sky: preset(220, 0.15),
  orange: preset(48, 0.17),
  teal: preset(185, 0.13),
  pink: preset(350, 0.17),
};

export const ACCENT_ORDER: AccentKey[] = [
  "amber",
  "rose",
  "emerald",
  "violet",
  "sky",
  "orange",
  "teal",
  "pink",
];

export const ACCENT_LABEL: Record<AccentKey, string> = {
  amber: "Amber",
  rose: "Rose",
  emerald: "Emerald",
  violet: "Violet",
  sky: "Sky",
  orange: "Orange",
  teal: "Teal",
  pink: "Pink",
};

// A representative tailwind class for the swatch dot in the UI.
export const ACCENT_SWATCH: Record<AccentKey, string> = {
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  sky: "bg-sky-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  pink: "bg-pink-500",
};

export const DEFAULT_ACCENT: AccentKey = "amber";

export function buildAccentCss(key: AccentKey): string {
  const t = ACCENT_PRESETS[key];
  return [
    `:root{`,
    `--brand:${t.light.brand};`,
    `--brand-foreground:${t.light.brandForeground};`,
    `--brand-soft:${t.light.brandSoft};`,
    `--ring:${t.light.ring};`,
    `--sidebar-primary:${t.light.sidebarPrimary};`,
    `--sidebar-primary-foreground:${t.light.sidebarPrimaryForeground};`,
    `--sidebar-ring:${t.light.sidebarRing};`,
    `--chart-1:${t.light.chart1};`,
    `--chart-5:${t.light.chart5};`,
    `}`,
    `.dark{`,
    `--brand:${t.dark.brand};`,
    `--brand-foreground:${t.dark.brandForeground};`,
    `--brand-soft:${t.dark.brandSoft};`,
    `--ring:${t.dark.ring};`,
    `--sidebar-primary:${t.dark.sidebarPrimary};`,
    `--sidebar-primary-foreground:${t.dark.sidebarPrimaryForeground};`,
    `--sidebar-ring:${t.dark.sidebarRing};`,
    `--chart-1:${t.dark.chart1};`,
    `--chart-5:${t.dark.chart5};`,
    `}`,
  ].join("");
}

export const ACCENT_STORAGE_KEY = "fragilume-accent";
export const ACCENT_STYLE_ID = "fragilume-accent-vars";

// Pre-built CSS for every accent, keyed by AccentKey. Used by the
// no-FOUC script so it can look up the right CSS without importing React.
const ALL_PRESETS_CSS: Record<AccentKey, string> = ACCENT_ORDER.reduce(
  (acc, key) => {
    acc[key] = buildAccentCss(key);
    return acc;
  },
  {} as Record<AccentKey, string>,
);

// Inline script to prevent FOUC: applies the stored accent before hydration.
// Safe to render via dangerouslySetInnerHTML in a server <head>.
export const accentNoFlashScript = `(function(){try{var k=localStorage.getItem("${ACCENT_STORAGE_KEY}");var m=${JSON.stringify(
  ALL_PRESETS_CSS,
)};var keys=${JSON.stringify(ACCENT_ORDER)};if(keys.indexOf(k)<0){k="${DEFAULT_ACCENT}";}var css=m[k];if(!css)return;var s=document.createElement("style");s.id="${ACCENT_STYLE_ID}";s.textContent=css;document.head.appendChild(s);}catch(e){}})();`;
