"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  BOOK_ACCENTS,
  BOOK_STATUSES,
  BOOK_STATUS_LABEL,
  BOOK_TYPES,
  type BookAccent,
  type BookStatus,
  type BookType,
} from "@/lib/domain";
import { ACCENT_DOT } from "@/lib/accent";
import { useAppStore } from "@/lib/store";

type BookPayload = {
  title: string;
  type: BookType;
  genre: string;
  description: string;
  accent: BookAccent;
  status: BookStatus;
};

export function BookFormDialog({
  open,
  onOpenChange,
  mode,
  bookId,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  bookId?: string;
  initial?: Partial<BookPayload>;
  onSaved?: (book: {
    id: string;
    title: string;
    type: string;
    genre: string | null;
    description: string | null;
    accent: string;
    status: string;
  }) => void;
}) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [type, setType] = React.useState<BookType>(
    (initial?.type as BookType) ?? "Novel"
  );
  const [genre, setGenre] = React.useState(initial?.genre ?? "");
  const [description, setDescription] = React.useState(
    initial?.description ?? ""
  );
  const [accent, setAccent] = React.useState<BookAccent>(
    initial?.accent ?? "amber"
  );
  const [status, setStatus] = React.useState<BookStatus>(
    (initial?.status as BookStatus) ?? "draft"
  );
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const activeProfileId = useAppStore((s) => s.activeProfileId);

  // Reset fields whenever the dialog opens.
  React.useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setType((initial?.type as BookType) ?? "Novel");
      setGenre(initial?.genre ?? "");
      setDescription(initial?.description ?? "");
      setAccent(initial?.accent ?? "amber");
      setStatus((initial?.status as BookStatus) ?? "draft");
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      toast({
        title: "Judul wajib diisi",
        description: "Beri judul untuk buku Anda.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      if (mode === "create" && !activeProfileId) {
        throw new Error("Profil aktif tidak ditemukan.");
      }
      const body: Record<string, unknown> = {
        title: t,
        type,
        genre: genre.trim() || undefined,
        description: description.trim() || undefined,
        accent,
        status,
      };
      if (mode === "create") body.profileId = activeProfileId;
      const url =
        mode === "create" ? "/api/books" : `/api/books/${bookId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Gagal menyimpan buku.");
      }
      const { book } = await res.json();
      toast({
        title: mode === "create" ? "Buku dibuat" : "Perubahan disimpan",
        description: `"${book.title}" siap.${mode === "create" ? " Klik untuk mulai mengedit." : ""}`,
      });
      onSaved?.(book);
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Terjadi kesalahan",
        description: err instanceof Error ? err.message : "Coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Buat Buku Baru" : "Edit Buku"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Mulai proyek baru — novel, komik, plot film, atau game."
              : "Ubah detail buku Anda."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bk-title">Judul</Label>
            <Input
              id="bk-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="cth. Senja di Kota Tua"
              autoFocus
              maxLength={120}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bk-type">Jenis Karya</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as BookType)}
              >
                <SelectTrigger id="bk-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOK_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as BookStatus)}
              >
                <SelectTrigger id="bk-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {BOOK_STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bk-genre">Genre</Label>
            <Input
              id="bk-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="cth. Fantasi, Romansa, Thriller"
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bk-desc">Sinopsis / Deskripsi</Label>
            <Textarea
              id="bk-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ringkasan singkat tentang karya ini."
              rows={3}
              maxLength={600}
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Warna Sampul</Label>
            <div className="flex flex-wrap gap-2">
              {BOOK_ACCENTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAccent(a)}
                  aria-label={`Warna ${a}`}
                  className={cn(
                    "h-7 w-7 rounded-full transition-transform",
                    ACCENT_DOT[a],
                    "ring-2 ring-offset-2 ring-offset-background",
                    accent === a ? "ring-foreground scale-110" : "ring-transparent"
                  )}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {loading
                ? "Menyimpan…"
                : mode === "create"
                ? "Buat Buku"
                : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
