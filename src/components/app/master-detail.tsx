"use client";

import * as React from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/components/language-provider";

/**
 * Responsive master-detail layout.
 * - Desktop: list panel on the left + detail pane on the right.
 * - Mobile: shows list; selecting an item shows the detail with a back button.
 */
export function MasterDetail({
  listTitle,
  searchPlaceholder,
  onAdd,
  addLabel,
  search,
  onSearchChange,
  list,
  selectedId,
  onBack,
  detail,
  emptyDetail,
}: {
  listTitle: string;
  searchPlaceholder?: string;
  onAdd: () => void;
  addLabel: string;
  search: string;
  onSearchChange: (v: string) => void;
  list: React.ReactNode;
  selectedId: string | null;
  onBack: () => void;
  detail: React.ReactNode;
  emptyDetail?: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="flex-1 min-h-0 flex">
      {/* List panel */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 shrink-0 border-r border-border/50 flex flex-col",
          "md:!flex",
          selectedId ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 border-b border-border/50 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight">{listTitle}</h2>
            <Button
              size="sm"
              onClick={onAdd}
              className="h-8 gap-1 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Plus className="h-3.5 w-3.5" /> {addLabel}
            </Button>
          </div>
          {searchPlaceholder ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 pl-8 text-[13px]"
              />
            </div>
          ) : null}
        </div>
        <div className="flex-1 overflow-y-auto fancy-scroll p-2">{list}</div>
      </div>

      {/* Detail panel */}
      <div
        className={cn(
          "flex-1 min-w-0 flex flex-col",
          selectedId ? "flex" : "hidden md:flex"
        )}
      >
        {selectedId ? (
          <>
            <div className="md:hidden p-2 border-b border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-1 h-8"
              >
                <ArrowLeft className="h-4 w-4" /> {t("common.back")}
              </Button>
            </div>
            {detail}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            {emptyDetail ?? (
              <div className="text-center text-sm text-muted-foreground">
                {t("masterDetail.selectHint")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export type ListItemProps = {
  active: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
};

export function MasterItem({
  active,
  onClick,
  badge,
  title,
  subtitle,
  meta,
}: ListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg px-3 py-2.5 transition-colors group",
        "hover:bg-accent",
        active && "bg-brand-soft"
      )}
    >
      <div className="flex items-center gap-2 mb-0.5">
        {badge}
        <h3
          className={cn(
            "text-[13px] font-medium leading-tight line-clamp-1 flex-1",
            active && "text-foreground"
          )}
        >
          {title}
        </h3>
      </div>
      {subtitle ? (
        <p className="text-[11px] text-muted-foreground line-clamp-1">
          {subtitle}
        </p>
      ) : null}
      {meta ? <div className="mt-1">{meta}</div> : null}
    </button>
  );
}
