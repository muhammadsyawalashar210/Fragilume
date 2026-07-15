"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
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
  Globe,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
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
import {
  useT,
  useLanguage,
} from "@/components/language-provider";
import { LOCALES, type Locale } from "@/lib/i18n";
import { FlagIcon } from "@/components/app/flag-icon";
import { ProfileFormDialog } from "./dialogs/profile-form-dialog";

export function SettingsView() {
  const t = useT();
  return (
    <div className="h-full overflow-y-auto fancy-scroll">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-7 sm:py-9 space-y-6">
        <SettingsHeader />
        <ProfilesSection />
        <ThemeSection />
        <AccentSection />
        <LanguageSection />
        <BackupSection />
        <p className="text-center text-[11px] text-muted-foreground pt-2 pb-4">
          {APP_FULL_NAME} · {APP_VERSION} — {t("app.dataLocal")}
        </p>
      </div>
    </div>
  );
}

function SettingsHeader() {
  const t = useT();
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand mb-2">
        <SettingsIcon className="h-3 w-3" />
        {t("settings.badge")}
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        {t("settings.title")}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {t("settings.subtitle")}
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
  const t = useT();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ProfileT | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ProfileT | null>(null);
  const [busy, setBusy] = React.useState(false);

  const reload = React.useCallback(async () => {
    try {
      const res = await fetch("/api/profiles", { cache: "no-store" });
      if (!res.ok) throw new Error(t("settings.profiles.errorLoadMsg"));
      const { profiles } = await res.json();
      setProfiles(profiles);
    } catch (err) {
      toast({
        title: t("settings.profiles.errorLoadTitle"),
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
  }, [toast, setProfiles, t]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  async function handleActivate(id: string) {
    setActiveProfileId(id);
    toast({ title: t("settings.profiles.activated") });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/profiles/${target.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(t("settings.profiles.errorDeleteMsg"));
      await reload();
      // If we deleted the active profile, pick another.
      if (activeProfileId === target.id) {
        const remaining = await fetch("/api/profiles", { cache: "no-store" })
          .then((r) => r.json())
          .then((d) => d.profiles as ProfileT[]);
        setActiveProfileId(remaining[0]?.id ?? null);
      }
      toast({
        title: t("settings.profiles.deleted"),
        description: t("settings.profiles.deletedDesc", { name: target.penName }),
      });
    } catch (err) {
      toast({
        title: t("settings.profiles.errorDelete"),
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
              <CardTitle className="text-base">
                {t("settings.profiles.title")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("settings.profiles.desc")}
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="h-8 gap-1 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="h-3.5 w-3.5" /> {t("settings.profiles.add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {profiles.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("settings.profiles.empty")}
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
                        {t("settings.profiles.active")}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    {p.bio || t("settings.profiles.noBio")} ·{" "}
                    {t("settings.profiles.bookCount", {
                      count: p._count?.books ?? 0,
                    })}
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
                      <Check className="h-3.5 w-3.5" />{" "}
                      {t("settings.profiles.activate")}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditTarget(p)}
                    aria-label={t("settings.profiles.editProfile")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(p)}
                    aria-label={t("settings.profiles.deleteProfile")}
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
            <AlertDialogTitle>
              {t("settings.profiles.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("settings.profiles.deleteDesc", {
                name: deleteTarget?.penName ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {t("common.delete")}
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
  const t = useT();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const options: {
    value: "light" | "dark" | "system";
    labelKey: string;
    icon: typeof Sun;
  }[] = [
    { value: "light", labelKey: "settings.theme.light", icon: Sun },
    { value: "dark", labelKey: "settings.theme.dark", icon: Moon },
    { value: "system", labelKey: "settings.theme.system", icon: Monitor },
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
            <CardTitle className="text-base">
              {t("settings.theme.title")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("settings.theme.desc")}
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
                <span className="text-xs font-medium">{t(opt.labelKey)}</span>
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
  const t = useT();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Palette className="h-[18px] w-[18px]" />
          </div>
          <div>
            <CardTitle className="text-base">
              {t("settings.accent.title")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("settings.accent.desc")}
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
                    title: t("settings.accent.updated"),
                    description: t("settings.accent.updatedDesc", {
                      name: ACCENT_LABEL[key],
                    }),
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
          {t("settings.accent.hint")}
        </p>
      </CardContent>
    </Card>
  );
}

/* ----------------- Language ----------------- */

function LanguageSection() {
  const { locale, setLocale } = useLanguage();
  const { toast } = useToast();
  const t = useT();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Globe className="h-[18px] w-[18px]" />
          </div>
          <div>
            <CardTitle className="text-base">
              {t("settings.language.title")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("settings.language.desc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {LOCALES.map((loc) => {
            const active = locale === loc.code;
            return (
              <button
                key={loc.code}
                type="button"
                onClick={() => {
                  setLocale(loc.code as Locale);
                  toast({
                    title: t("settings.language.updated"),
                    description: loc.label,
                  });
                }}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition-all",
                  active
                    ? "border-brand bg-brand-soft"
                    : "border-border/60 hover:bg-accent/50",
                )}
              >
                <FlagIcon code={loc.flag} size={22} className="shrink-0" />
                <div className="flex-1 min-w-0 text-left">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      active ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {loc.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {loc.englishLabel}
                  </div>
                </div>
                {active ? (
                  <Check className="h-4 w-4 text-brand shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          {t("settings.language.hint")}
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
  const t = useT();
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
          title: t("settings.backup.exportOk"),
          description:
            result.method === "filesystem"
              ? t("settings.backup.exportOkFs")
              : t("settings.backup.exportOkDl"),
        });
      } else {
        toast({
          title: t("settings.backup.exportFail"),
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
          title: t("settings.backup.importOk"),
          description: result.counts
            ? t("settings.backup.importOkDesc", {
                profiles: result.counts.profiles,
                books: result.counts.books,
              })
            : undefined,
        });
        setView("dashboard");
      } else {
        toast({
          title: t("settings.backup.importFail"),
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
            <CardTitle className="text-base">
              {t("settings.backup.title")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("settings.backup.desc")}
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
            {exporting
              ? t("settings.backup.exporting")
              : t("settings.backup.export")}
          </Button>
          <Button
            onClick={handleImport}
            disabled={importing}
            variant="outline"
            className="flex-1 h-10 gap-1.5"
          >
            <Upload className="h-4 w-4" />
            {importing
              ? t("settings.backup.importing")
              : t("settings.backup.import")}
          </Button>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
            <Info className="h-3.5 w-3.5 text-brand" />
            {t("settings.backup.aboutTitle")}
          </div>
          <ul className="text-[11px] text-muted-foreground space-y-1 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <FileJson className="h-3 w-3 mt-0.5 shrink-0" />
              {t("settings.backup.fmtJson")}
            </li>
            <li className="flex items-start gap-1.5">
              <HardDriveDownload className="h-3 w-3 mt-0.5 shrink-0" />
              {t("settings.backup.fmtDocs")}
            </li>
            <li className="flex items-start gap-1.5">
              <Upload className="h-3 w-3 mt-0.5 shrink-0" />
              {t("settings.backup.fmtRestore")}
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
