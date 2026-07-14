// Tiny relative date formatter in Indonesian (no external deps beyond date-fns which is available).
import { formatDistanceToNowStrict } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export function formatRelative(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return (
      formatDistanceToNowStrict(d, { addSuffix: true, locale: idLocale }) || ""
    );
  } catch {
    return "";
  }
}
