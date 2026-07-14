"use client";

import { Feather, Minus, Square, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAppStore } from "@/lib/store";

export function WindowChrome() {
  const author = useAppStore((s) => s.author);

  return (
    <header className="h-11 shrink-0 w-full flex items-center justify-between px-3 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 select-none">
      {/* Left: app identity */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-brand-foreground shadow-sm">
          <Feather className="h-4 w-4" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-semibold tracking-tight">
            Writer&apos;s Studio
          </span>
          {author?.penName ? (
            <span className="hidden sm:inline text-[11px] text-muted-foreground">
              · oleh {author.penName}
            </span>
          ) : null}
        </div>
      </div>

      {/* Right: window controls aesthetic + theme toggle */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <div className="ml-1 flex items-center gap-0.5 pl-2 border-l border-border/60">
          <button
            type="button"
            aria-label="Minimalkan"
            className="inline-flex h-8 w-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Maksimalkan"
            className="inline-flex h-8 w-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Tutup"
            className="inline-flex h-8 w-9 items-center justify-center text-muted-foreground hover:text-white hover:bg-destructive rounded-md transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
