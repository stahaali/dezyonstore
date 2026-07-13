"use client";

import Link from "next/link";
import { categories } from "@/data/categories";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MegaMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-foreground outline-none hover:bg-muted">
        Categories
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[720px] rounded-2xl border border-border bg-card/95 p-6 shadow-xl backdrop-blur-xl"
      >
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
            >
              {cat.name}
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                {cat.productCount} items
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <Link href="/categories" className="text-sm font-semibold text-accent hover:underline">
            View all categories →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
