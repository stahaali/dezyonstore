"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import {
  CatalogViewSortBar,
  type CatalogSortOption,
} from "@/components/category/catalog-view-sort-bar";
import { ProductLoadMoreList } from "@/components/product/product-load-more-list";

function sortProducts(list: Product[], sortBy: CatalogSortOption): Product[] {
  const next = [...list];
  switch (sortBy) {
    case "Price Low - High":
      return next.sort((a, b) => a.price - b.price);
    case "Price High - Low":
      return next.sort((a, b) => b.price - a.price);
    case "Popularity":
      return next.sort((a, b) => b.reviewCount - a.reviewCount);
    case "A - Z":
      return next.sort((a, b) => a.name.localeCompare(b.name));
    case "Z - A":
      return next.sort((a, b) => b.name.localeCompare(a.name));
    case "Highest Rated":
      return next.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
    case "Recently Added":
      return next.sort((a, b) =>
        (b.createdAt || "").localeCompare(a.createdAt || ""),
      );
    case "Relevance":
    default:
      return next;
  }
}

/** Sort By + grid/list toolbar for product listings (e.g. /products search) */
export function ProductSortToolbar({ products }: { products: Product[] }) {
  const [sortBy, setSortBy] = useState<CatalogSortOption>("Relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sorted = useMemo(
    () => sortProducts(products, sortBy),
    [products, sortBy],
  );

  return (
    <div>
      <CatalogViewSortBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ProductLoadMoreList
        products={sorted}
        viewMode={viewMode}
        denseGrid
        pageSize={15}
      />
    </div>
  );
}
