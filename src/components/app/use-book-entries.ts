"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/components/language-provider";

/**
 * Generic CRUD hook for book sub-resources (plot / world / wiki).
 * `endpoint` is the base path, e.g. `/api/books/<id>/plot`.
 */
export function useBookEntries<T extends { id: string }>(
  bookId: string | null,
  endpointBase: (id: string) => string
) {
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const t = useT();

  const endpoint = bookId ? endpointBase(bookId) : null;

  const load = React.useCallback(async () => {
    if (!endpoint) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error(t("crud.errorLoadMsg"));
      const { nodes, entries } = await res.json();
      setItems((nodes ?? entries ?? []) as T[]);
    } catch (err) {
      toast({
        title: t("crud.errorLoad"),
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [endpoint, toast, t]);

  React.useEffect(() => {
    load();
  }, [load]);

  const create = React.useCallback(
    async (data: Record<string, unknown>): Promise<T | null> => {
      if (!endpoint) return null;
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d?.error || t("crud.errorCreateMsg"));
        }
        const { node, entry } = await res.json();
        const created = (node ?? entry) as T;
        setItems((prev) => [...prev, created]);
        return created;
      } catch (err) {
        toast({
          title: t("crud.errorCreate"),
          description: err instanceof Error ? err.message : "",
          variant: "destructive",
        });
        return null;
      }
    },
    [endpoint, toast, t]
  );

  const patch = React.useCallback(
    async (id: string, data: Record<string, unknown>): Promise<T | null> => {
      if (!endpoint) return null;
      try {
        const res = await fetch(`${endpoint}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d?.error || t("crud.errorSaveMsg"));
        }
        const { node, entry } = await res.json();
        const updated = (node ?? entry) as T;
        setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
        return updated;
      } catch (err) {
        toast({
          title: t("crud.errorSave"),
          description: err instanceof Error ? err.message : "",
          variant: "destructive",
        });
        return null;
      }
    },
    [endpoint, toast, t]
  );

  const remove = React.useCallback(
    async (id: string): Promise<boolean> => {
      if (!endpoint) return false;
      try {
        const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(t("crud.errorDeleteMsg"));
        setItems((prev) => prev.filter((it) => it.id !== id));
        return true;
      } catch (err) {
        toast({
          title: t("crud.errorDelete"),
          description: err instanceof Error ? err.message : "",
          variant: "destructive",
        });
        return false;
      }
    },
    [endpoint, toast, t]
  );

  return { items, loading, reload: load, create, patch, remove };
}
