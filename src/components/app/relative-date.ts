// Relative date formatter that supports both Indonesian and English (US).
import { formatDistanceToNowStrict } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { enUS as enUSLocale } from "date-fns/locale";
import type { Locale } from "@/lib/i18n";

const LOCALE_MAP = {
  id: idLocale,
  "en-US": enUSLocale,
} as const;

export function formatRelative(iso: string, locale: Locale = "id"): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const dateFnsLocale = LOCALE_MAP[locale] ?? idLocale;
    return (
      formatDistanceToNowStrict(d, {
        addSuffix: true,
        locale: dateFnsLocale,
      }) || ""
    );
  } catch {
    return "";
  }
}
