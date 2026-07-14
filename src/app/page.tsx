"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import { WindowChrome } from "@/components/app/window-chrome";
import { FloatingSidebar } from "@/components/app/floating-sidebar";
import { Onboarding } from "@/components/app/onboarding";
import { Dashboard } from "@/components/app/dashboard";
import { BookEditor } from "@/components/app/book-editor";
import { StatusBar } from "@/components/app/status-bar";

export default function Home() {
  const author = useAppStore((s) => s.author);
  const setAuthor = useAppStore((s) => s.setAuthor);
  const view = useAppStore((s) => s.view);
  const [checking, setChecking] = React.useState(true);

  // First-run detection: is there an author yet?
  React.useEffect(() => {
    let active = true;
    fetch("/api/author", { cache: "no-store" })
      .then((r) => r.json())
      .then(({ author }) => {
        if (active && author) setAuthor(author);
      })
      .catch(() => {})
      .finally(() => active && setChecking(false));
    return () => {
      active = false;
    };
  }, [setAuthor]);

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

  // First run: ask for pen name.
  if (!author) {
    return <Onboarding />;
  }

  return (
    <div className="app-bg h-screen flex flex-col overflow-hidden">
      <WindowChrome />
      <div className="flex-1 min-h-0 relative">
        <FloatingSidebar />
        <main className="h-full pl-[76px] sm:pl-[88px] pr-0">
          {view === "dashboard" ? <Dashboard /> : <BookEditor />}
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
