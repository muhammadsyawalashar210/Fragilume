"use client";

import * as React from "react";
import {
  ACCENT_ORDER,
  DEFAULT_ACCENT,
  buildAccentCss,
  ACCENT_STORAGE_KEY,
  ACCENT_STYLE_ID,
  type AccentKey,
} from "@/lib/accent-presets";

// Re-export so consumers can import from one place.
export {
  ACCENT_ORDER,
  ACCENT_LABEL,
  ACCENT_SWATCH,
  DEFAULT_ACCENT,
  type AccentKey,
} from "@/lib/accent-presets";

// Validate a stored string is a real preset key.
function isAccentKey(v: unknown): v is AccentKey {
  return typeof v === "string" && (ACCENT_ORDER as string[]).includes(v);
}

function readStoredAccent(): AccentKey {
  try {
    const v = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (isAccentKey(v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_ACCENT;
}

function writeStoredAccent(key: AccentKey) {
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, key);
  } catch {
    /* ignore */
  }
}

function applyAccent(key: AccentKey) {
  if (typeof document === "undefined") return;
  const css = buildAccentCss(key);
  let el = document.getElementById(ACCENT_STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = ACCENT_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

type AccentContextValue = {
  accent: AccentKey;
  setAccent: (key: AccentKey) => void;
};

const AccentContext = React.createContext<AccentContextValue | null>(null);

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = React.useState<AccentKey>(DEFAULT_ACCENT);
  const [mounted, setMounted] = React.useState(false);

  // Read stored accent on mount and apply it (the no-FOUC script in <head>
  // already applied it pre-hydration; this just syncs React state).
  React.useEffect(() => {
    const stored = readStoredAccent();
    setAccentState(stored);
    applyAccent(stored);
    setMounted(true);
  }, []);

  // Re-apply when accent changes (after mount).
  React.useEffect(() => {
    if (!mounted) return;
    applyAccent(accent);
  }, [accent, mounted]);

  const setAccent = React.useCallback((key: AccentKey) => {
    setAccentState(key);
    writeStoredAccent(key);
  }, []);

  const value = React.useMemo(
    () => ({ accent, setAccent }),
    [accent, setAccent],
  );

  return (
    <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
  );
}

export function useAccent(): AccentContextValue {
  const ctx = React.useContext(AccentContext);
  if (!ctx) {
    // Safe fallback if used outside provider (shouldn't happen).
    return {
      accent: DEFAULT_ACCENT,
      setAccent: () => {
        /* no-op */
      },
    };
  }
  return ctx;
}
