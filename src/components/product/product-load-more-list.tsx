"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types";
import { StoreProductCard } from "@/components/product/store-product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE = 12;
const LOAD_DELAY_MS = 550;

interface ProductLoadMoreListProps {
  products: Product[];
  viewMode?: "grid" | "list";
  pageSize?: number;
  /** Extra columns for /products (5 on xl) */
  denseGrid?: boolean;
  className?: string;
}

export function ProductLoadMoreList({
  products,
  viewMode = "grid",
  pageSize = DEFAULT_PAGE_SIZE,
  denseGrid = false,
  className,
}: ProductLoadMoreListProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Reset when the filtered/sorted list changes
  useEffect(() => {
    setVisibleCount(pageSize);
    setLoadingMore(false);
    loadingRef.current = false;
  }, [products, pageSize]);

  const hasMore = visibleCount < products.length;
  const remaining = products.length - visibleCount;
  const nextBatch = Math.min(pageSize, remaining);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (loadingRef.current) return;
        if (visibleCount >= products.length) return;

        loadingRef.current = true;
        setLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((n) => Math.min(n + pageSize, products.length));
          setLoadingMore(false);
          loadingRef.current = false;
        }, LOAD_DELAY_MS);
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleCount, products.length, pageSize]);

  const visible = products.slice(0, visibleCount);

  const gridClass = denseGrid
    ? "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    : "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={cn(className)}>
      {viewMode === "grid" ? (
        <div className={gridClass}>
          {visible.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
          {loadingMore
            ? Array.from({ length: nextBatch }).map((_, i) => (
                <ProductCardSkeleton key={`load-skel-${i}`} layout="grid" />
              ))
            : null}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((product) => (
            <StoreProductCard
              key={product.id}
              product={product}
              layout="list"
            />
          ))}
          {loadingMore
            ? Array.from({ length: nextBatch }).map((_, i) => (
                <ProductCardSkeleton key={`load-skel-${i}`} layout="list" />
              ))
            : null}
        </div>
      )}

      {/* Invisible sentinel — triggers auto load when scrolled near */}
      {hasMore || loadingMore ? (
        <div
          ref={sentinelRef}
          className="mt-6 flex h-8 items-center justify-center"
          aria-hidden
        />
      ) : null}

      {!hasMore && !loadingMore && products.length > pageSize ? (
        <p className="mt-6 text-center text-sm text-gray-500">
          Showing all {products.length} products
        </p>
      ) : null}
    </div>
  );
}
