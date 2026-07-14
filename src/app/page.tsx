"use client";

import * as React from "react";
import { useAppStore, readStoredActiveProfile } from "@/lib/store";
import { WindowChrome } from "@/components/app/window-chrome";
import {
  FloatingSidebar,
  MobileTopBar,
  MobileNavDrawer,
} from "@/components/app/nav-rail";
import { Onboarding } from "@/components/app/onboarding";
import { Dashboard } from "@/components/app/dashboard";
import { BookEditor } from "@/components/app/book-editor";
import { SettingsView } from "@/components/app/settings-view";
import { StatusBar } from "@/components/app/status-bar";
import type { ProfileT } from "@/lib/types";

export default function Home() {
  const profiles = useAppStore((s) => s.profiles);
  const setProfiles = useAppStore((s) => s.setProfiles);
  const setActiveProfileId = useAppStore((s) => s.setActiveProfileId);
  const activeProfileId = useAppStore((s) => s.activeProfileId);
  const view = useAppStore((s) => s.view);
  const [checking, setChecking] = React.useState(true);

  // First-run detection: are there any profiles yet?
  React.useEffect(() => {
    let active = true;
    fetch("/api/profiles", { cache: "no-store" })
      .then((r) => r.json())
      .then(({ profiles }: { profiles: ProfileT[] }) => {
        if (!active) return;
        setProfiles(profiles);
        if (profiles.length > 0) {
          const stored = readStoredActiveProfile();
          const initial =
            profiles.find((p) => p.id === stored) ?? profiles[0];
          setActiveProfileId(initial.id);
        }
      })
      .catch(() => {})
      .finally(() => active && setChecking(false));
    return () => {
      active = false;
    };
  }, [setProfiles, setActiveProfileId]);

  if (checking) {
    return (
      <div className="app-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Memuat studio…</p>
        </div>
      </div>
    );
  }

  // First run: no profiles yet → ask for pen name.
  if (profiles.length === 0) {
    return <Onboarding />;
  }

  return (
    <div className="app-bg h-screen flex flex-col overflow-hidden">
      <WindowChrome />
      <MobileTopBar />
      <div className="flex-1 min-h-0 relative">
        <FloatingSidebar />
        <MobileNavDrawer />
        <main className="h-full md:pl-[88px]">
          {view === "dashboard" && (
            <Dashboard key={activeProfileId ?? "none"} />
          )}
          {view === "settings" && <SettingsView />}
          {(view === "plot" || view === "world" || view === "wiki") && (
            <BookEditor />
          )}
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
