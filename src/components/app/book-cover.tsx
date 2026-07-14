"use client";

import { BookText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCENT_GRADIENT } from "@/lib/accent";
import type { BookAccent } from "@/lib/domain";

export function BookCover({
  title,
  type,
  author,
  accent,
  className,
}: {
  title: string;
  type: string;
  author?: string | null;
  accent: BookAccent;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-full rounded-xl overflow-hidden",
        "bg-gradient-to-br shadow-lg shadow-black/10 dark:shadow-black/40",
        "ring-1 ring-black/5 dark:ring-white/10",
        ACCENT_GRADIENT[accent],
        className
      )}
    >
      {/* spine highlight */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-black/15" />
      <div className="absolute left-[6px] top-0 bottom-0 w-px bg-white/20" />

      {/* sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />

      {/* content */}
      <div className="relative h-full w-full flex flex-col justify-between p-3 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">
            {type}
          </span>
          <BookText className="h-3.5 w-3.5 text-white/70" />
        </div>

        <div className="px-0.5">
          <h3 className="font-semibold leading-snug line-clamp-4 text-balance drop-shadow-sm">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="h-px flex-1 bg-white/30" />
          {author ? (
            <span className="text-[10px] text-white/80 truncate max-w-[80%]">
              {author}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
