"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type CatalogSortOption =
  | "Price Low - High"
  | "Price High - Low"
  | "Popularity"
  | "A - Z"
  | "Z - A"
  | "Highest Rated"
  | "Recently Added"
  | "Relevance";

export const CATALOG_SORT_OPTIONS: CatalogSortOption[] = [
  "Price Low - High",
  "Price High - Low",
  "Popularity",
  "A - Z",
  "Z - A",
  "Highest Rated",
  "Recently Added",
  "Relevance",
];

/** Reference-style: [grid] [list] then sort label + chevron inline */
function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <rect x="1" y="1" width="6.5" height="6.5" rx="1.2" />
      <rect x="10.5" y="1" width="6.5" height="6.5" rx="1.2" />
      <rect x="1" y="10.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.2" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <circle cx="2.5" cy="4" r="1.4" />
      <rect x="6" y="3" width="11" height="2" rx="1" />
      <circle cx="2.5" cy="9" r="1.4" />
      <rect x="6" y="8" width="11" height="2" rx="1" />
      <circle cx="2.5" cy="14" r="1.4" />
      <rect x="6" y="13" width="11" height="2" rx="1" />
    </svg>
  );
}

interface CatalogViewSortBarProps {
  sortBy: CatalogSortOption;
  onSortChange: (value: CatalogSortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (value: "grid" | "list") => void;
  className?: string;
}

export function CatalogViewSortBar({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  className,
}: CatalogViewSortBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center justify-end gap-3",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {/* Two icons first — ahead of sort, like CZone */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "cursor-pointer p-0.5 transition-opacity",
              viewMode === "grid"
                ? "text-gray-900 opacity-100"
                : "text-gray-400 opacity-70 hover:opacity-100",
            )}
          >
            <GridIcon className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
            className={cn(
              "cursor-pointer p-0.5 transition-opacity",
              viewMode === "list"
                ? "text-gray-900 opacity-100"
                : "text-gray-400 opacity-70 hover:opacity-100",
            )}
          >
            <ListIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-800"
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            <span>{sortBy}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-gray-700 transition",
                sortOpen && "rotate-180",
              )}
              strokeWidth={2.5}
            />
          </button>
          {sortOpen ? (
            <ul
              role="listbox"
              className="absolute right-0 z-30 mt-1 min-w-[180px] overflow-hidden rounded border border-gray-200 bg-white py-1 shadow-lg"
            >
              {CATALOG_SORT_OPTIONS.map((option) => (
                <li key={option} role="option" aria-selected={sortBy === option}>
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange(option);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm",
                      sortBy === option
                        ? "bg-[#2563eb] font-medium text-white"
                        : "text-gray-800 hover:bg-gray-100",
                    )}
                  >
                    <span>{option}</span>
                    {sortBy === option ? (
                      <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
