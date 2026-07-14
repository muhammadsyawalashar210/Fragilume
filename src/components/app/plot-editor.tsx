"use client";

import * as React from "react";
import { Trash2, Workflow, Plus, Check, Loader2 } from "lucide-react";
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
  PLOT_KIND_LABEL,
  PLOT_KINDS,
  type PlotKind,
} from "@/lib/domain";
import type { PlotNodeT } from "@/lib/types";
import { useBookEntries } from "./use-book-entries";
import { MasterDetail, MasterItem } from "./master-detail";

const KIND_BADGE_CLASS: Record<PlotKind, string> = {
  act: "bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/20",
  chapter: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
  scene: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20",
  beat: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  note: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/20",
};

export function PlotEditor({ bookId }: { bookId: string }) {
  const { items, loading, create, patch, remove } = useBookEntries<PlotNodeT>(
    bookId,
    (id) => `/api/books/${id}/plot`
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
        (n.summary ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const selected = items.find((n) => n.id === selectedId) ?? null;

  async function handleAdd() {
    const created = await create({
      title: "Bagian Baru",
      kind: "chapter",
      summary: "",
      content: "",
    });
    if (created) setSelectedId(created.id);
  }

  return (
    <>
      <MasterDetail
        listTitle="Struktur Plot"
        addLabel="Tambah"
        searchPlaceholder="Cari bab/adegan…"
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
              noun="plot"
            />
          ) : (
            <div className="space-y-1">
              {filtered.map((node, i) => (
                <MasterItem
                  key={node.id}
                  active={node.id === selectedId}
                  onClick={() => setSelectedId(node.id)}
                  badge={
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1.5 py-0 h-4 font-medium",
                        KIND_BADGE_CLASS[node.kind as PlotKind] ??
                          KIND_BADGE_CLASS.chapter
                      )}
                    >
                      {PLOT_KIND_LABEL[node.kind as PlotKind] ?? node.kind}
                    </Badge>
                  }
                  title={`${i + 1}. ${node.title}`}
                  subtitle={node.summary || "Tanpa ringkasan"}
                />
              ))}
            </div>
          )
        }
        detail={
          selected ? (
            <PlotDetail
              key={selected.id}
              node={selected}
              onPatch={(data) => patch(selected.id, data)}
              onDelete={() => setDeleteOpen(true)}
            />
          ) : null
        }
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus bagian ini?</AlertDialogTitle>
            <AlertDialogDescription>
              “{selected?.title}” akan dihapus dari struktur plot.
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

function PlotDetail({
  node,
  onPatch,
  onDelete,
}: {
  node: PlotNodeT;
  onPatch: (data: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = React.useState(node.title);
  const [kind, setKind] = React.useState<PlotKind>(
    (node.kind as PlotKind) ?? "chapter"
  );
  const [summary, setSummary] = React.useState(node.summary ?? "");
  const [content, setContent] = React.useState(node.content ?? "");
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = React.useRef(true);

  // Re-hydrate when switching nodes.
  React.useEffect(() => {
    setTitle(node.title);
    setKind((node.kind as PlotKind) ?? "chapter");
    setSummary(node.summary ?? "");
    setContent(node.content ?? "");
    setStatus("idle");
    first.current = true;
  }, [node.id]);

  // Debounced autosave.
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await onPatch({ title, kind, summary, content });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [title, kind, summary, content]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Workflow className="h-3.5 w-3.5" />
          Editor Plot
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
          placeholder="Judul bab / adegan…"
          className="text-xl font-semibold h-auto py-1 border-0 px-0 bg-transparent focus-visible:ring-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Jenis</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as PlotKind)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLOT_KINDS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {PLOT_KIND_LABEL[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5 mt-4">
          <Label htmlFor="summary" className="text-xs">
            Ringkasan
          </Label>
          <Input
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Satu kalimat singkat tentang bagian ini."
            className="h-9"
          />
        </div>

        <div className="space-y-1.5 mt-4">
          <Label htmlFor="content" className="text-xs">
            Naskah / Catatan
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis adegan, dialog, atau catatan plot di sini…"
            rows={16}
            className="resize-none min-h-[280px] leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

export function SaveBadge({
  status,
}: {
  status: "idle" | "saving" | "saved";
}) {
  if (status === "saving")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Menyimpan…
      </span>
    );
  if (status === "saved")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
        <Check className="h-3 w-3" /> Tersimpan
      </span>
    );
  return null;
}

export function ListSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
}

export function ListEmpty({
  hasItems,
  onAdd,
  noun,
}: {
  hasItems: boolean;
  onAdd: () => void;
  noun: string;
}) {
  return (
    <div className="p-6 text-center">
      <Plus className="h-6 w-6 mx-auto text-muted-foreground/60 mb-2" />
      <p className="text-xs text-muted-foreground">
        {hasItems ? "Tidak ada yang cocok." : `Belum ada ${noun}.`}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAdd}
        className="mt-2 h-7 text-xs gap-1"
      >
        <Plus className="h-3.5 w-3.5" /> Tambah
      </Button>
    </div>
  );
}
