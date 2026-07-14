"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Workflow,
  Globe2,
  BookMarked,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore, type AppView } from "@/lib/store";
import { BOOK_STATUS_LABEL, type BookStatus } from "@/lib/domain";
import { ACCENT_DOT } from "@/lib/accent";
import type { BookWithCounts } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { BookCover } from "./book-cover";
import { BookFormDialog } from "./dialogs/book-form-dialog";
import { PlotEditor } from "./plot-editor";
import { WorldEditor } from "./world-editor";
import { WikiEditor } from "./wiki-editor";

const TABS: { view: AppView; label: string; icon: LucideIcon }[] = [
  { view: "plot", label: "Plot", icon: Workflow },
  { view: "world", label: "World Building", icon: Globe2 },
  { view: "wiki", label: "Wiki", icon: BookMarked },
];

export function BookEditor() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const selectedBookId = useAppStore((s) => s.selectedBookId);
  const selectedBookTitle = useAppStore((s) => s.selectedBookTitle);
  const selectBook = useAppStore((s) => s.selectBook);
  const { toast } = useToast();

  const [book, setBook] = React.useState<BookWithCounts | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [editOpen, setEditOpen] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (!selectedBookId) {
      setBook(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/books/${selectedBookId}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(({ book }) => {
        if (active) {
          setBook(book);
          selectBook(book.id, book.title);
        }
      })
      .catch(() => {
        if (active)
          toast({
            title: "Gagal memuat buku",
            description: "Buka dashboard dan coba lagi.",
            variant: "destructive",
          });
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [selectedBookId]);

  if (!selectedBookId) {
    return <NoBookSelected />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 sm:px-7 pt-5 pb-3 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("dashboard")}
              className="h-8 mt-0.5 shrink-0 gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>

            <div className="min-w-0">
              {loading || !book ? (
                <>
                  <div className="h-3 w-24 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-6 w-64 bg-muted rounded animate-pulse" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          ACCENT_DOT[book.accent as keyof typeof ACCENT_DOT] ??
                            "bg-amber-500"
                        )}
                      />
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                        {book.type}
                      </span>
                      <Badge variant="secondary" className="text-[10px] h-5">
                        {BOOK_STATUS_LABEL[book.status as BookStatus] ??
                          book.status}
                      </Badge>
                      {book.genre ? (
                        <span className="text-[11px] text-muted-foreground">
                          · {book.genre}
                        </span>
                      ) : null}
                    </div>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
                    {book.title}
                  </h1>
                </>
              )}
            </div>
          </div>

          {book ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="h-8 gap-1 shrink-0"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit Buku</span>
            </Button>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = view === tab.view;
            return (
              <button
                key={tab.view}
                type="button"
                onClick={() => setView(tab.view)}
                className={cn(
                  "relative h-9 px-3.5 rounded-t-lg text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {active && (
                  <motion.span
                    layoutId="editor-tab"
                    className="absolute -bottom-px left-2 right-2 h-0.5 rounded-full bg-brand"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active sub-editor */}
      <div className="flex-1 min-h-0 flex flex-col">
        {view === "plot" && <PlotEditor bookId={selectedBookId} />}
        {view === "world" && <WorldEditor bookId={selectedBookId} />}
        {view === "wiki" && <WikiEditor bookId={selectedBookId} />}
      </div>

      {book ? (
        <BookFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          mode="edit"
          bookId={book.id}
          initial={{
            title: book.title,
            type: book.type as any,
            genre: book.genre ?? "",
            description: book.description ?? "",
            accent: book.accent as any,
            status: book.status as BookStatus,
          }}
          onSaved={(updated) => {
            setBook((prev) =>
              prev ? { ...prev, ...updated, _count: prev._count } : prev
            );
            selectBook(updated.id, updated.title);
          }}
        />
      ) : null}
    </div>
  );
}

function NoBookSelected() {
  const setView = useAppStore((s) => s.setView);
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand mb-4">
        <BookMarked className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold">Belum ada buku dipilih</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
        Pilih buku dari dashboard untuk mulai mengedit plot, world building,
        atau wiki.
      </p>
      <Button
        onClick={() => setView("dashboard")}
        className="mt-5 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
      >
        <ArrowLeft className="h-4 w-4" /> Buka Dashboard
      </Button>
    </div>
  );
}
