"use client";

import * as React from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  translate,
  type Locale,
} from "@/lib/i18n";

type TranslateFn = (
  key: string,
  params?: Record<string, string | number>,
) => string;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TranslateFn;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

function writeStoredLocale(l: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, l);
  } catch {
    /* ignore */
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);

  // Read stored locale on mount.
  React.useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
  }, []);

  // Keep <html lang> in sync with the active locale.
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang =
        locale === "en-US" ? "en" : locale;
    }
  }, [locale]);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    writeStoredLocale(l);
  }, []);

  const t = React.useCallback<TranslateFn>(
    (key, params) => translate(locale, key, params),
    [locale],
  );

  const value = React.useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    // Safe fallback (shouldn't happen — provider is in root layout).
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {
        /* no-op */
      },
      t: (key, params) => translate(DEFAULT_LOCALE, key, params),
    };
  }
  return ctx;
}

// Convenience hook: returns just the translate function.
export function useT(): TranslateFn {
  return useLanguage().t;
}
