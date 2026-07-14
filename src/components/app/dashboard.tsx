"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  BookOpen,
  Workflow,
  Globe2,
  BookMarked,
  Library,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  BOOK_STATUS_LABEL,
  BOOK_TYPES,
  type BookAccent,
  type BookStatus,
  type BookType,
} from "@/lib/domain";
import { ACCENT_DOT } from "@/lib/accent";
import type { BookWithCounts } from "@/lib/types";
import { BookCover } from "./book-cover";
import { BookFormDialog } from "./dialogs/book-form-dialog";
import { formatRelative } from "./relative-date";

export function Dashboard() {
  const [books, setBooks] = React.useState<BookWithCounts[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | BookType>("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<BookWithCounts | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<BookWithCounts | null>(null);

  const { toast } = useToast();
  const author = useAppStore((s) => s.author);
  const openEditor = useAppStore((s) => s.openEditor);

  const loadBooks = React.useCallback(async () => {
    try {
      const res = await fetch("/api/books", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat buku.");
      const { books } = (await res.json()) as { books: BookWithCounts[] };
      setBooks(books);
    } catch (err) {
      toast({
        title: "Gagal memuat rak buku",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const filtered = React.useMemo(() => {
    return books.filter((b) => {
      if (typeFilter !== "all" && b.type !== typeFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        (b.genre ?? "").toLowerCase().includes(q) ||
        (b.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [books, query, typeFilter]);

  async function handleDelete() {
    if (!deleteTarget) return;
    const t = deleteTarget;
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/books/${t.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus buku.");
      setBooks((prev) => prev.filter((b) => b.id !== t.id));
      toast({ title: "Buku dihapus", description: `"${t.title}" telah dihapus.` });
    } catch (err) {
      toast({
        title: "Gagal menghapus",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border/50">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand mb-2">
              <Sparkles className="h-3 w-3" />
              DASHBOARD
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Selamat datang, {author?.penName?.split(" ")[0] ?? "Penulis"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola semua karya Anda di satu rak. Buat, atur, edit, dan hapus
              buku dengan bebas.
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-10 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="h-4 w-4" />
            Buat Buku
          </Button>
        </div>

        {/* Toolbar */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, genre…"
              className="pl-9 h-9"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <FilterChip
              active={typeFilter === "all"}
              onClick={() => setTypeFilter("all")}
            >
              Semua
            </FilterChip>
            {BOOK_TYPES.map((t) => (
              <FilterChip
                key={t}
                active={typeFilter === t}
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto fancy-scroll px-6 sm:px-8 py-6">
        {loading ? (
          <BookGridSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            hasBooks={books.length > 0}
            onCreate={() => setCreateOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {filtered.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(i * 0.03, 0.25) }}
              >
                <BookCard
                  book={book}
                  onOpen={() => openEditor(book.id, book.title, "plot")}
                  onEdit={() => setEditTarget(book)}
                  onDelete={() => setDeleteTarget(book)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <BookFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSaved={() => loadBooks()}
      />
      <BookFormDialog
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        mode="edit"
        bookId={editTarget?.id}
        initial={
          editTarget
            ? {
                title: editTarget.title,
                type: editTarget.type as BookType,
                genre: editTarget.genre ?? "",
                description: editTarget.description ?? "",
                accent: editTarget.accent as BookAccent,
                status: editTarget.status as BookStatus,
              }
            : undefined
        }
        onSaved={() => loadBooks()}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus buku ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Buku <span className="font-medium text-foreground">“{deleteTarget?.title}”</span>{" "}
              beserta semua plot, world building, dan wiki di dalamnya akan
              dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 px-3 rounded-full text-xs font-medium transition-colors",
        "border border-border/60",
        active
          ? "bg-foreground text-background border-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}

function BookCard({
  book,
  onOpen,
  onEdit,
  onDelete,
}: {
  book: BookWithCounts;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusLabel =
    BOOK_STATUS_LABEL[book.status as BookStatus] ?? book.status;
  const counts = book._count;

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        <div className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-[-0.5deg]">
          <BookCover
            title={book.title}
            type={book.type}
            accent={book.accent as any}
          />
        </div>
      </button>

      {/* Card menu */}
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Opsi buku"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur hover:bg-black/60"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onOpen}>
              <BookOpen className="h-4 w-4 mr-2" /> Buka
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" /> Edit / Ganti Nama
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Meta */}
      <div className="mt-2.5 px-0.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={cn("h-2 w-2 rounded-full", ACCENT_DOT[book.accent as keyof typeof ACCENT_DOT] ?? "bg-amber-500")}
          />
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            {book.type}
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">{statusLabel}</span>
        </div>
        <h3 className="text-sm font-medium leading-snug line-clamp-2">
          {book.title}
        </h3>
        {book.genre ? (
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            {book.genre}
          </p>
        ) : null}
        <div className="flex items-center gap-2.5 mt-2 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5" title="Plot">
            <Workflow className="h-3 w-3" />
            {counts?.plotNodes ?? 0}
          </span>
          <span className="inline-flex items-center gap-0.5" title="World Building">
            <Globe2 className="h-3 w-3" />
            {counts?.worldEntries ?? 0}
          </span>
          <span className="inline-flex items-center gap-0.5" title="Wiki">
            <BookMarked className="h-3 w-3" />
            {counts?.wikiEntries ?? 0}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground/70 mt-1">
          {formatRelative(book.updatedAt)}
        </p>
      </div>
    </div>
  );
}

function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] w-full rounded-xl bg-muted animate-pulse" />
          <div className="h-3 w-2/3 bg-muted rounded mt-2.5 animate-pulse" />
          <div className="h-2.5 w-1/3 bg-muted rounded mt-1.5 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasBooks,
  onCreate,
}: {
  hasBooks: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand mb-4">
        <Library className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold">
        {hasBooks ? "Tidak ada buku yang cocok" : "Rak buku Anda masih kosong"}
      </h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
        {hasBooks
          ? "Coba ubah kata kunci pencarian atau filter jenis karya."
          : "Mulai buat buku pertama Anda — novel, komik, plot film, atau game. Semua bisa diatur dari sini."}
      </p>
      {!hasBooks && (
        <Button
          onClick={onCreate}
          className="mt-5 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
        >
          <Plus className="h-4 w-4" /> Buat Buku Pertama
        </Button>
      )}
    </div>
  );
}
