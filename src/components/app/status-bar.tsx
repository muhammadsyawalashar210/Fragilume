"use client";

import { Circle, HardDrive } from "lucide-react";
import { useAppStore, type AppView } from "@/lib/store";
import { LogoMark } from "@/components/app/logo";
import { APP_NAME, APP_VERSION } from "@/lib/brand";
import { useT } from "@/components/language-provider";

const VIEW_LABEL_KEY: Record<AppView, string> = {
  dashboard: "status.dashboard",
  plot: "status.editorPlot",
  world: "status.editorWorld",
  wiki: "status.editorWiki",
  settings: "status.settings",
};

export function StatusBar() {
  const activeProfile = useAppStore((s) => s.activeProfile);
  const view = useAppStore((s) => s.view);
  const bookTitle = useAppStore((s) => s.selectedBookTitle);
  const t = useT();

  return (
    <footer className="h-7 shrink-0 w-full flex items-center justify-between px-3 text-[11px] text-muted-foreground border-t border-border/60 bg-background/80 backdrop-blur">
      <div className="flex items-center gap-3 min-w-0">
        <span className="inline-flex items-center gap-1.5">
          <LogoMark size={12} className="text-brand" />
          <span className="font-medium text-foreground/80 truncate max-w-[120px]">
            {activeProfile?.penName ?? "Tanpa profil"}
          </span>
        </span>
        <span className="opacity-40">·</span>
        <span className="truncate">{t(VIEW_LABEL_KEY[view])}</span>
        {bookTitle && view !== "dashboard" && view !== "settings" ? (
          <>
            <span className="opacity-40">/</span>
            <span className="truncate text-foreground/70">{bookTitle}</span>
          </>
        ) : null}
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <span className="inline-flex items-center gap-1">
          <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
          {t("status.savedLocal")}
        </span>
        <span className="opacity-40">·</span>
        <span className="inline-flex items-center gap-1">
          <HardDrive className="h-3 w-3" />
          {APP_NAME} {APP_VERSION}
        </span>
      </div>
    </footer>
  );
}
