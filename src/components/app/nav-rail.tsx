"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  ChevronRight,
  Workflow,
  Globe2,
  BookMarked,
  Settings,
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
import { LogoMark } from "@/components/app/logo";
import { APP_NAME, APP_VERSION } from "@/lib/brand";

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

/**
 * Shared navigation content used by both the desktop floating rail
 * (icon-only) and the mobile slide-out drawer (icons + labels).
 */
function NavContent({
  showLabels,
  onNavigate,
}: {
  showLabels: boolean;
  onNavigate?: () => void;
}) {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const selectedBookId = useAppStore((s) => s.selectedBookId);
  const activeProfile = useAppStore((s) => s.activeProfile);

  const editorActive =
    view === "plot" || view === "world" || view === "wiki";
  const [editorOpen, setEditorOpen] = React.useState(editorActive);

  React.useEffect(() => {
    if (editorActive) setEditorOpen(true);
  }, [editorActive]);

  const initials = React.useMemo(() => {
    const name = activeProfile?.penName?.trim() || "?";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [activeProfile?.penName]);

  const go = (v: AppView) => {
    setView(v);
    onNavigate?.();
  };

  if (showLabels) {
    return (
      <div className="flex flex-col h-full">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border/60 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <LogoMark size={18} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">
              {APP_NAME}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {activeProfile?.penName ?? "Tanpa profil"}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto fancy-scroll p-3 space-y-1">
          <LabelItem
            label="Dashboard"
            icon={LayoutDashboard}
            active={view === "dashboard"}
            onClick={() => go("dashboard")}
          />
          <LabelGroup
            label="Edit Buku"
            icon={BookOpen}
            open={editorOpen}
            onToggle={() => setEditorOpen((v) => !v)}
            disabled={!selectedBookId}
          >
            {EDIT_CHILDREN.map((c) => (
              <LabelSubItem
                key={c.view}
                label={c.label}
                icon={c.icon}
                active={view === c.view}
                disabled={!selectedBookId}
                onClick={() => selectedBookId && go(c.view)}
              />
            ))}
          </LabelGroup>
          <LabelItem
            label="Pengaturan"
            icon={Settings}
            active={view === "settings"}
            onClick={() => go("settings")}
          />
        </nav>

        <div className="p-3 border-t border-border/60">
          <button
            type="button"
            onClick={() => go("settings")}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground font-semibold text-xs ring-1 ring-border/60">
              {initials}
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-medium truncate">
                {activeProfile?.penName ?? "Tanpa nama"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                Kelola profil
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Icon-only rail (desktop)
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col items-center gap-1.5 h-full">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm mb-1">
          <LogoMark size={22} />
        </div>
        <div className="h-px w-8 bg-border/70 my-0.5" />

        <IconItem
          label="Dashboard"
          desc="Rak buku Anda"
          icon={LayoutDashboard}
          active={view === "dashboard"}
          onClick={() => go("dashboard")}
        />
        <IconItem
          label="Edit Buku"
          desc="Plot · World Building · Wiki"
          icon={BookOpen}
          active={editorActive}
          chevron={editorOpen}
          onClick={() => setEditorOpen((v) => !v)}
        />

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
                <IconSubItem
                  key={child.view}
                  label={child.label}
                  desc={child.desc}
                  icon={child.icon}
                  active={view === child.view}
                  onClick={() => selectedBookId && go(child.view)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1" />

        <IconItem
          label="Pengaturan"
          desc="Profil, tema, backup"
          icon={Settings}
          active={view === "settings"}
          onClick={() => go("settings")}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => go("settings")}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                "bg-muted text-foreground font-semibold text-[13px]",
                "ring-1 ring-border/60 hover:ring-brand/50 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label={`Profil: ${activeProfile?.penName ?? ""}`}
            >
              {initials}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            <div className="font-medium">
              {activeProfile?.penName ?? "Tanpa nama"}
            </div>
            <div className="text-muted-foreground">Buka pengaturan</div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

/* ---------- Desktop floating rail ---------- */

export function FloatingSidebar() {
  return (
    <aside className="pointer-events-none fixed left-3 top-14 bottom-3 z-30 hidden md:block">
      <nav
        className={cn(
          "pointer-events-auto h-full w-[68px] flex flex-col items-center gap-1.5",
          "rounded-2xl border border-border/60 bg-card/85 glass",
          "py-3 px-2 shadow-xl shadow-black/5 dark:shadow-black/30"
        )}
      >
        <NavContent showLabels={false} />
      </nav>
    </aside>
  );
}

/* ---------- Mobile top bar ---------- */

export function MobileTopBar() {
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);
  const setView = useAppStore((s) => s.setView);
  const activeProfile = useAppStore((s) => s.activeProfile);

  return (
    <header className="md:hidden h-12 shrink-0 flex items-center justify-between px-3 border-b border-border/60 bg-background/80 backdrop-blur">
      <button
        type="button"
        aria-label="Buka menu"
        onClick={() => setMobileNavOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
      >
        <LogoMark size={20} />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold tracking-tight">
          {APP_NAME}
        </span>
        <span className="text-[9px] text-muted-foreground/70 font-mono">
          {APP_VERSION}
        </span>
        {activeProfile?.penName ? (
          <span className="hidden xs:inline text-[11px] text-muted-foreground">
            · {activeProfile.penName}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        aria-label="Pengaturan"
        onClick={() => setView("settings")}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
      >
        <Settings className="h-[18px] w-[18px]" />
      </button>
    </header>
  );
}

/* ---------- Mobile slide-out drawer ---------- */

export function MobileNavDrawer() {
  const open = useAppStore((s) => s.mobileNavOpen);
  const setOpen = useAppStore((s) => s.setMobileNavOpen);

  React.useEffect(() => {
    // Lock body scroll while the drawer is open.
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <div className="md:hidden" aria-hidden={!open}>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="backdrop"
              type="button"
              aria-label="Tutup menu"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-card border-r border-border/60 shadow-2xl"
            >
              <NavContent showLabels onNavigate={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Small building blocks ---------- */

function IconItem({
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

function IconSubItem({
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

function LabelItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm transition-colors",
        active
          ? "bg-brand-soft text-foreground font-medium"
          : "text-foreground/80 hover:text-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
      {label}
    </button>
  );
}

function LabelGroup({
  label,
  icon: Icon,
  open,
  onToggle,
  disabled,
  children,
}: {
  label: string;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm transition-colors",
          "text-foreground/80 hover:text-foreground hover:bg-accent"
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
        <span className="flex-1 text-left">{label}</span>
        {disabled ? (
          <span className="text-[10px] text-muted-foreground">pilih buku</span>
        ) : (
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              open && "rotate-90"
            )}
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && !disabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden ml-[18px] border-l border-border/60 pl-2 mt-0.5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LabelSubItem({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-[13px] transition-colors",
        active
          ? "bg-brand-soft text-foreground font-medium"
          : "text-foreground/70 hover:text-foreground hover:bg-accent",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.9} />
      {label}
    </button>
  );
}
