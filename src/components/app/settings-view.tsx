"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  User,
  Users,
  Plus,
  Pencil,
  Trash2,
  Check,
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  Settings as SettingsIcon,
  Info,
  HardDriveDownload,
  FileJson,
  Palette,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { exportBackup, importBackup } from "@/lib/backup";
import type { ProfileT } from "@/lib/types";
import { APP_FULL_NAME, APP_VERSION } from "@/lib/brand";
import {
  ACCENT_ORDER,
  ACCENT_LABEL,
  ACCENT_SWATCH,
} from "@/lib/accent-presets";
import { useAccent } from "@/components/accent-provider";
import { ProfileFormDialog } from "./dialogs/profile-form-dialog";

export function SettingsView() {
  const { toast } = useToast();

  return (
    <div className="h-full overflow-y-auto fancy-scroll">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-7 sm:py-9 space-y-6">
        <SettingsHeader />
        <ProfilesSection />
        <ThemeSection />
        <AccentSection />
        <BackupSection />
        <p className="text-center text-[11px] text-muted-foreground pt-2 pb-4">
          {APP_FULL_NAME} · {APP_VERSION} — data tersimpan lokal di perangkat ini
        </p>
      </div>
    </div>
  );
}

function SettingsHeader() {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand mb-2">
        <SettingsIcon className="h-3 w-3" />
        PENGATURAN
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        Pengaturan
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Kelola profil penulis, tampilan, dan backup data studio Anda.
      </p>
    </div>
  );
}

/* ----------------- Profiles ----------------- */

function ProfilesSection() {
  const { toast } = useToast();
  const profiles = useAppStore((s) => s.profiles);
  const setProfiles = useAppStore((s) => s.setProfiles);
  const activeProfileId = useAppStore((s) => s.activeProfileId);
  const setActiveProfileId = useAppStore((s) => s.setActiveProfileId);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ProfileT | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ProfileT | null>(null);
  const [busy, setBusy] = React.useState(false);

  const reload = React.useCallback(async () => {
    try {
      const res = await fetch("/api/profiles", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat profil.");
      const { profiles } = await res.json();
      setProfiles(profiles);
    } catch (err) {
      toast({
        title: "Gagal memuat profil",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
  }, [toast, setProfiles]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  async function handleActivate(id: string) {
    setActiveProfileId(id);
    toast({ title: "Profil aktif diganti" });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const t = deleteTarget;
    setDeleteTarget(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/profiles/${t.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus profil.");
      await reload();
      // If we deleted the active profile, pick another.
      if (activeProfileId === t.id) {
        const remaining = await fetch("/api/profiles", { cache: "no-store" })
          .then((r) => r.json())
          .then((d) => d.profiles as ProfileT[]);
        setActiveProfileId(remaining[0]?.id ?? null);
      }
      toast({
        title: "Profil dihapus",
        description: `"${t.penName}" beserta semua bukunya telah dihapus.`,
      });
    } catch (err) {
      toast({
        title: "Gagal menghapus",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Users className="h-[18px] w-[18px]" />
            </div>
            <div>
              <CardTitle className="text-base">Profil Penulis</CardTitle>
              <CardDescription className="text-xs">
                Tiap profil punya rak buku sendiri.
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="h-8 gap-1 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {profiles.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Belum ada profil.
          </p>
        ) : (
          profiles.map((p) => {
            const isActive = p.id === activeProfileId;
            return (
              <motion.div
                key={p.id}
                layout
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                  isActive
                    ? "border-brand/40 bg-brand-soft"
                    : "border-border/60 hover:bg-accent/50"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground font-semibold text-sm ring-1 ring-border/60">
                  {initialsOf(p.penName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {p.penName}
                    </span>
                    {isActive ? (
                      <Badge className="text-[10px] h-5 bg-brand text-brand-foreground">
                        Aktif
                      </Badge>
                    ) : null}
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    {p.bio || "Tanpa bio"} · {p._count?.books ?? 0} buku
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleActivate(p.id)}
                      className="h-8 gap-1 text-xs"
                    >
                      <Check className="h-3.5 w-3.5" /> Aktifkan
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditTarget(p)}
                    aria-label="Edit profil"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(p)}
                    aria-label="Hapus profil"
                    disabled={busy}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </CardContent>

      <ProfileFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSaved={reload}
      />
      <ProfileFormDialog
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        mode="edit"
        profileId={editTarget?.id}
        initial={
          editTarget
            ? { penName: editTarget.penName, bio: editTarget.bio ?? "" }
            : undefined
        }
        onSaved={reload}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus profil ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Profil <span className="font-medium text-foreground">“{deleteTarget?.penName}”</span>{" "}
              beserta semua buku, plot, world building, dan wiki di dalamnya
              akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

/* ----------------- Theme ----------------- */

function ThemeSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const options: {
    value: "light" | "dark" | "system";
    label: string;
    icon: typeof Sun;
    desc: string;
  }[] = [
    { value: "light", label: "Terang", icon: Sun, desc: "Mode terang" },
    { value: "dark", label: "Gelap", icon: Moon, desc: "Mode gelap" },
    {
      value: "system",
      label: "Sistem",
      icon: Monitor,
      desc: "Ikut sistem",
    },
  ];

  const current = mounted ? (theme as string) : "dark";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Sun className="h-[18px] w-[18px]" />
          </div>
          <div>
            <CardTitle className="text-base">Tampilan</CardTitle>
            <CardDescription className="text-xs">
              Pilih mode terang, gelap, atau ikut sistem.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2.5">
          {options.map((opt) => {
            const Icon = opt.icon;
            const active = current === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                  active
                    ? "border-brand bg-brand-soft text-foreground"
                    : "border-border/60 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------- Accent color ----------------- */

function AccentSection() {
  const { accent, setAccent } = useAccent();
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Palette className="h-[18px] w-[18px]" />
          </div>
          <div>
            <CardTitle className="text-base">Warna Aksen</CardTitle>
            <CardDescription className="text-xs">
              Personalisasi warna utama studio Anda.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {ACCENT_ORDER.map((key) => {
            const active = accent === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setAccent(key);
                  toast({
                    title: "Aksen diperbarui",
                    description: `Warna utama: ${ACCENT_LABEL[key]}`,
                  });
                }}
                aria-label={ACCENT_LABEL[key]}
                aria-pressed={active}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all",
                  active
                    ? "border-brand bg-brand-soft"
                    : "border-border/60 hover:bg-accent/50",
                )}
              >
                <span
                  className={cn(
                    "h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform",
                    ACCENT_SWATCH[key],
                    active
                      ? "ring-foreground/30 scale-110"
                      : "ring-transparent group-hover:ring-foreground/15",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {ACCENT_LABEL[key]}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          Aksen diterapkan ke seluruh studio: sidebar, tombol utama, indikator
          aktif, dan fokus ring. Pilihan disimpan di perangkat ini.
        </p>
      </CardContent>
    </Card>
  );
}

/* ----------------- Backup & Restore ----------------- */

function BackupSection() {
  const { toast } = useToast();
  const setProfiles = useAppStore((s) => s.setProfiles);
  const setActiveProfileId = useAppStore((s) => s.setActiveProfileId);
  const setView = useAppStore((s) => s.setView);
  const [exporting, setExporting] = React.useState(false);
  const [importing, setImporting] = React.useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const result = await exportBackup();
      if (result.cancelled) {
        // silent
      } else if (result.ok) {
        toast({
          title: "Backup berhasil disimpan",
          description:
            result.method === "filesystem"
              ? "File tersimpan ke folder Documents."
              : "File diunduh ke folder unduhan.",
        });
      } else {
        toast({
          title: "Gagal backup",
          description: result.error,
          variant: "destructive",
        });
      }
    } finally {
      setExporting(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const result = await importBackup();
      if (result.cancelled) {
        // silent
      } else if (result.ok) {
        // Reload profiles + pick active.
        const res = await fetch("/api/profiles", { cache: "no-store" });
        const { profiles } = await res.json();
        setProfiles(profiles);
        const stored = localStorage.getItem("ws-active-profile");
        const active =
          profiles.find((p: ProfileT) => p.id === stored) ?? profiles[0];
        setActiveProfileId(active?.id ?? null);
        toast({
          title: "Backup berhasil dipulihkan",
          description: result.counts
            ? `${result.counts.profiles} profil · ${result.counts.books} buku.`
            : undefined,
        });
        setView("dashboard");
      } else {
        toast({
          title: "Gagal restore",
          description: result.error,
          variant: "destructive",
        });
      }
    } finally {
      setImporting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <HardDriveDownload className="h-[18px] w-[18px]" />
          </div>
          <div>
            <CardTitle className="text-base">Backup &amp; Restore</CardTitle>
            <CardDescription className="text-xs">
              Ekspor seluruh studio ke satu file, atau pulihkan dari backup.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 h-10 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Mengekspor…" : "Ekspor Backup"}
          </Button>
          <Button
            onClick={handleImport}
            disabled={importing}
            variant="outline"
            className="flex-1 h-10 gap-1.5"
          >
            <Upload className="h-4 w-4" />
            {importing ? "Memulihkan…" : "Impor / Restore"}
          </Button>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
            <Info className="h-3.5 w-3.5 text-brand" />
            Tentang format &amp; penyimpanan
          </div>
          <ul className="text-[11px] text-muted-foreground space-y-1 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <FileJson className="h-3 w-3 mt-0.5 shrink-0" />
              Format file: <code className="text-foreground/70">.json</code> —
              menyimpan semua profil, buku, plot, world building, &amp; wiki
              secara utuh dan bisa dipulihkan.
            </li>
            <li className="flex items-start gap-1.5">
              <HardDriveDownload className="h-3 w-3 mt-0.5 shrink-0" />
              File disimpan ke folder <strong>Documents</strong> default
              (Windows lokal/OneDrive, macOS, Linux). Pada browser tanpa File
              System Access, file akan diunduh ke folder unduhan.
            </li>
            <li className="flex items-start gap-1.5">
              <Upload className="h-3 w-3 mt-0.5 shrink-0" />
              Restore mengganti seluruh data saat ini dengan isi file backup.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------- helpers ----------------- */

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
