"use client";

import * as React from "react";
import { Trash2, BookMarked } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  WIKI_CATEGORIES,
  WIKI_CATEGORY_LABEL,
  type WikiCategory,
} from "@/lib/domain";
import type { WikiEntryT } from "@/lib/types";
import { useBookEntries } from "./use-book-entries";
import { MasterDetail, MasterItem } from "./master-detail";
import { SaveBadge, ListSkeleton, ListEmpty } from "./plot-editor";

const CAT_DOT: Record<WikiCategory, string> = {
  character: "bg-rose-500",
  item: "bg-amber-500",
  faction: "bg-violet-500",
  location: "bg-sky-500",
  event: "bg-emerald-500",
  concept: "bg-teal-500",
  other: "bg-zinc-500",
};

export function WikiEditor({ bookId }: { bookId: string }) {
  const { items, loading, create, patch, remove } = useBookEntries<WikiEntryT>(
    bookId,
    (id) => `/api/books/${id}/wiki`
  );

  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.tags ?? "").toLowerCase().includes(q) ||
        (n.content ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const selected = items.find((n) => n.id === selectedId) ?? null;

  async function handleAdd() {
    const created = await create({
      title: "Entri Wiki Baru",
      category: "character",
      content: "",
      tags: "",
    });
    if (created) setSelectedId(created.id);
  }

  return (
    <>
      <MasterDetail
        listTitle="Wiki Karya"
        addLabel="Tambah"
        searchPlaceholder="Cari karakter, item…"
        search={search}
        onSearchChange={setSearch}
        onAdd={handleAdd}
        selectedId={selectedId}
        onBack={() => setSelectedId(null)}
        list={
          loading ? (
            <ListSkeleton />
          ) : filtered.length === 0 ? (
            <ListEmpty
              hasItems={items.length > 0}
              onAdd={handleAdd}
              noun="entri wiki"
            />
          ) : (
            <div className="space-y-1">
              {filtered.map((entry) => (
                <MasterItem
                  key={entry.id}
                  active={entry.id === selectedId}
                  onClick={() => setSelectedId(entry.id)}
                  badge={
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        CAT_DOT[entry.category as WikiCategory] ?? CAT_DOT.other
                      )}
                    />
                  }
                  title={entry.title}
                  subtitle={
                    WIKI_CATEGORY_LABEL[entry.category as WikiCategory] ??
                    entry.category
                  }
                  meta={
                    entry.tags ? (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                      </div>
                    ) : null
                  }
                />
              ))}
            </div>
          )
        }
        detail={
          selected ? (
            <WikiDetail
              key={selected.id}
              entry={selected}
              onPatch={(data) => patch(selected.id, data)}
              onDelete={() => setDeleteOpen(true)}
            />
          ) : null
        }
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus entri wiki ini?</AlertDialogTitle>
            <AlertDialogDescription>
              “{selected?.title}” akan dihapus dari wiki.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={async () => {
                if (selectedId && (await remove(selectedId))) {
                  setSelectedId(null);
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function WikiDetail({
  entry,
  onPatch,
  onDelete,
}: {
  entry: WikiEntryT;
  onPatch: (data: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = React.useState(entry.title);
  const [category, setCategory] = React.useState<WikiCategory>(
    (entry.category as WikiCategory) ?? "character"
  );
  const [tags, setTags] = React.useState(entry.tags ?? "");
  const [content, setContent] = React.useState(entry.content ?? "");
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = React.useRef(true);

  React.useEffect(() => {
    setTitle(entry.title);
    setCategory((entry.category as WikiCategory) ?? "character");
    setTags(entry.tags ?? "");
    setContent(entry.content ?? "");
    setStatus("idle");
    first.current = true;
  }, [entry.id]);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await onPatch({ title, category, tags, content });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [title, category, tags, content]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookMarked className="h-3.5 w-3.5" />
          Wiki
        </div>
        <div className="flex items-center gap-2">
          <SaveBadge status={status} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> Hapus
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto fancy-scroll p-5 sm:p-6 max-w-3xl w-full">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nama karakter / item / faksi…"
          className="text-xl font-semibold h-auto py-1 border-0 px-0 bg-transparent focus-visible:ring-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Kategori</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as WikiCategory)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WIKI_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    <span className="inline-flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", CAT_DOT[c])} />
                      {WIKI_CATEGORY_LABEL[c]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="w-tags" className="text-xs">
              Tag (pisahkan dengan koma)
            </Label>
            <Input
              id="w-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="protagonis, ksatria, api"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-1.5 mt-4">
          <Label htmlFor="w-content" className="text-xs">
            Deskripsi
          </Label>
          <Textarea
            id="w-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Latar belakang, sifat, penampilan, hubungan, kekuatan…"
            rows={18}
            className="resize-none min-h-[320px] leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
