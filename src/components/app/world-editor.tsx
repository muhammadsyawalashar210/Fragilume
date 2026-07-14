"use client";

import * as React from "react";
import { Trash2, Globe2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  WORLD_CATEGORIES,
  WORLD_CATEGORY_LABEL,
  type WorldCategory,
} from "@/lib/domain";
import type { WorldEntryT } from "@/lib/types";
import { useBookEntries } from "./use-book-entries";
import { MasterDetail, MasterItem } from "./master-detail";
import { SaveBadge, ListSkeleton, ListEmpty } from "./plot-editor";

const CAT_DOT: Record<WorldCategory, string> = {
  location: "bg-sky-500",
  culture: "bg-amber-500",
  history: "bg-stone-500",
  magic: "bg-violet-500",
  tech: "bg-emerald-500",
  religion: "bg-rose-500",
  geography: "bg-teal-500",
  lore: "bg-orange-500",
  other: "bg-zinc-500",
};

export function WorldEditor({ bookId }: { bookId: string }) {
  const { items, loading, create, patch, remove } = useBookEntries<WorldEntryT>(
    bookId,
    (id) => `/api/books/${id}/world`
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
        (n.content ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const selected = items.find((n) => n.id === selectedId) ?? null;

  async function handleAdd() {
    const created = await create({
      title: "Entri Dunia Baru",
      category: "location",
      content: "",
    });
    if (created) setSelectedId(created.id);
  }

  return (
    <>
      <MasterDetail
        listTitle="World Building"
        addLabel="Tambah"
        searchPlaceholder="Cari lokasi, budaya…"
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
              noun="entri dunia"
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
                        CAT_DOT[entry.category as WorldCategory] ??
                          CAT_DOT.other
                      )}
                    />
                  }
                  title={entry.title}
                  subtitle={
                    WORLD_CATEGORY_LABEL[entry.category as WorldCategory] ??
                    entry.category
                  }
                />
              ))}
            </div>
          )
        }
        detail={
          selected ? (
            <WorldDetail
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
            <AlertDialogTitle>Hapus entri ini?</AlertDialogTitle>
            <AlertDialogDescription>
              “{selected?.title}” akan dihapus dari world building.
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

function WorldDetail({
  entry,
  onPatch,
  onDelete,
}: {
  entry: WorldEntryT;
  onPatch: (data: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = React.useState(entry.title);
  const [category, setCategory] = React.useState<WorldCategory>(
    (entry.category as WorldCategory) ?? "other"
  );
  const [content, setContent] = React.useState(entry.content ?? "");
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = React.useRef(true);

  React.useEffect(() => {
    setTitle(entry.title);
    setCategory((entry.category as WorldCategory) ?? "other");
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
      await onPatch({ title, category, content });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [title, category, content]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Globe2 className="h-3.5 w-3.5" />
          World Building
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
          placeholder="Nama lokasi / budaya / sistem…"
          className="text-xl font-semibold h-auto py-1 border-0 px-0 bg-transparent focus-visible:ring-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Kategori</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as WorldCategory)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORLD_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          CAT_DOT[c]
                        )}
                      />
                      {WORLD_CATEGORY_LABEL[c]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5 mt-4">
          <Label htmlFor="w-content" className="text-xs">
            Deskripsi & Detail
          </Label>
          <Textarea
            id="w-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Geografi, sejarah, budaya, aturan magis, teknologi… jelaskan detail dunia Anda."
            rows={18}
            className="resize-none min-h-[320px] leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
