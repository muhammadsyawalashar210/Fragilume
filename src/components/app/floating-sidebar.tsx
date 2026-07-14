"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Feather,
  LayoutDashboard,
  BookOpen,
  ChevronRight,
  Workflow,
  Globe2,
  BookMarked,
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppStore, type AppView } from "@/lib/store";

type NavLeaf = {
  view: AppView;
  label: string;
  icon: LucideIcon;
  desc: string;
};

const EDIT_CHILDREN: NavLeaf[] = [
  { view: "plot", label: "Plot", icon: Workflow, desc: "Struktur cerita" },
  { view: "world", label: "World Building", icon: Globe2, desc: "Dunia cerita" },
  { view: "wiki", label: "Wiki", icon: BookMarked, desc: "Karakter & ensiklopedia" },
];

export function FloatingSidebar() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const selectedBookId = useAppStore((s) => s.selectedBookId);
  const selectedBookTitle = useAppStore((s) => s.selectedBookTitle);
  const author = useAppStore((s) => s.author);

  const editorActive =
    view === "plot" || view === "world" || view === "wiki";
  const [editorOpen, setEditorOpen] = React.useState(editorActive);

  // Keep the subtree open whenever an editor view is active.
  React.useEffect(() => {
    if (editorActive) setEditorOpen(true);
  }, [editorActive]);

  const initials = React.useMemo(() => {
    const name = author?.penName?.trim() || "?";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [author?.penName]);

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="pointer-events-none fixed left-3 top-14 bottom-3 z-30">
        <nav
          className={cn(
            "pointer-events-auto h-full w-[68px] flex flex-col items-center gap-1.5",
            "rounded-2xl border border-border/60 bg-card/85 glass",
            "py-3 px-2 shadow-xl shadow-black/5 dark:shadow-black/30"
          )}
        >
          {/* Brand monogram */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm mb-1">
            <Feather className="h-5 w-5" />
          </div>

          <div className="h-px w-8 bg-border/70 my-0.5" />

          {/* Dashboard */}
          <SideButton
            label="Dashboard"
            desc="Rak buku Anda"
            icon={LayoutDashboard}
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          />

          {/* Edit Buku (parent) */}
          <SideButton
            label="Edit Buku"
            desc="Plot · World Building · Wiki"
            icon={BookOpen}
            active={editorActive}
            chevron={editorOpen}
            onClick={() => setEditorOpen((v) => !v)}
          />

          {/* Sub-tree: Plot, World Building, Wiki (appear below Edit Buku) */}
          <AnimatePresence initial={false}>
            {editorOpen && (
              <motion.div
                key="subtree"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="w-full overflow-hidden flex flex-col items-center gap-1.5 mt-0.5"
              >
                <span className="h-5 w-px bg-border/70" aria-hidden />
                {EDIT_CHILDREN.map((child) => (
                  <SubButton
                    key={child.view}
                    label={child.label}
                    desc={child.desc}
                    icon={child.icon}
                    active={view === child.view}
                    onClick={() => setView(child.view)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Author avatar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  "bg-muted text-foreground font-semibold text-[13px]",
                  "ring-1 ring-border/60 hover:ring-brand/50 transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-label={`Penulis: ${author?.penName ?? ""}`}
              >
                {initials}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              <div className="font-medium">{author?.penName ?? "Tanpa nama"}</div>
              <div className="text-muted-foreground">Nama pena aktif</div>
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}

function SideButton({
  label,
  desc,
  icon: Icon,
  active,
  chevron,
  onClick,
}: {
  label: string;
  desc: string;
  icon: LucideIcon;
  active: boolean;
  chevron?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all",
            "text-foreground/70 hover:text-foreground hover:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active && "bg-brand-soft text-foreground"
          )}
        >
          {/* active indicator bar */}
          <span
            className={cn(
              "absolute -left-2 h-6 w-1 rounded-full bg-brand transition-opacity",
              active ? "opacity-100" : "opacity-0"
            )}
          />
          <Icon className="h-[20px] w-[20px]" strokeWidth={1.9} />
          {chevron !== undefined && (
            <ChevronRight
              className={cn(
                "absolute -right-0.5 -bottom-0.5 h-3 w-3 text-muted-foreground transition-transform",
                chevron && "rotate-90"
              )}
            />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground">{desc}</div>
      </TooltipContent>
    </Tooltip>
  );
}

function SubButton({
  label,
  desc,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  desc: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all",
            "text-foreground/65 hover:text-foreground hover:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active && "bg-brand-soft text-foreground"
          )}
        >
          <span
            className={cn(
              "absolute -left-2.5 h-5 w-1 rounded-full bg-brand transition-opacity",
              active ? "opacity-100" : "opacity-0"
            )}
          />
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground">{desc}</div>
      </TooltipContent>
    </Tooltip>
  );
}
