"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Minus } from "lucide-react";
import type { Product } from "@/types";
import { StoreProductCard } from "@/components/product/store-product-card";
import { cn } from "@/lib/utils";

type BrandFacet = { name: string; count: number };

interface CategoryCatalogProps {
  categoryName: string;
  products: Product[];
}

function buildBrandFacets(products: Product[]): BrandFacet[] {
  const map = new Map<string, number>();
  for (const p of products) {
    map.set(p.brandName, (map.get(p.brandName) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-300/80 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="text-sm font-bold text-gray-900">{title}</span>
        {open ? (
          <Minus className="h-3.5 w-3.5 text-gray-700" strokeWidth={2.5} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-700" strokeWidth={2.5} />
        )}
      </button>
      {open ? <div className="px-4 pb-4">{children}</div> : null}
    </div>
  );
}

export function CategoryCatalog({
  categoryName,
  products,
}: CategoryCatalogProps) {
  const brandFacets = useMemo(() => buildBrandFacets(products), [products]);

  const inStockCount = products.filter((p) => p.inStock).length;
  const outStockCount = products.length - inStockCount;

  const [open, setOpen] = useState({
    category: true,
    brand: true,
    availability: true,
  });

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [availability, setAvailability] = useState<{
    inStock: boolean;
    outOfStock: boolean;
  }>({ inStock: false, outOfStock: false });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  function toggleBrand(name: string) {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name],
    );
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brandName)) {
        return false;
      }
      if (availability.inStock || availability.outOfStock) {
        if (availability.inStock && availability.outOfStock) {
          // both checked = no filter
        } else if (availability.inStock && !p.inStock) return false;
        else if (availability.outOfStock && p.inStock) return false;
      }
      return true;
    });
  }, [products, selectedBrands, availability]);

  const sidebar = (
    <aside className="overflow-hidden rounded-xl border border-gray-200 bg-[#f2f2f2]">
      <FilterSection
        title="Category"
        open={open.category}
        onToggle={() => setOpen((s) => ({ ...s, category: !s.category }))}
      >
        <p className="text-sm font-medium text-gray-800">{categoryName}</p>
      </FilterSection>

      <FilterSection
        title="Brand"
        open={open.brand}
        onToggle={() => setOpen((s) => ({ ...s, brand: !s.brand }))}
      >
        <ul className="space-y-2.5">
          {brandFacets.map((brand) => (
            <li key={brand.name}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.name)}
                  onChange={() => toggleBrand(brand.name)}
                  className="h-4 w-4 rounded border-gray-400 accent-gray-900"
                />
                <span>
                  {brand.name} ({brand.count})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection
        title="Availability"
        open={open.availability}
        onToggle={() =>
          setOpen((s) => ({ ...s, availability: !s.availability }))
        }
      >
        <ul className="space-y-2.5">
          <li>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={availability.inStock}
                onChange={(e) =>
                  setAvailability((s) => ({ ...s, inStock: e.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-400 accent-gray-900"
              />
              <span>In Stock ({inStockCount})</span>
            </label>
          </li>
          <li>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={availability.outOfStock}
                onChange={(e) =>
                  setAvailability((s) => ({
                    ...s,
                    outOfStock: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-400 accent-gray-900"
              />
              <span>On Order Only ({outStockCount})</span>
            </label>
          </li>
        </ul>
      </FilterSection>
    </aside>
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 lg:hidden"
        >
          {mobileFiltersOpen ? "Hide filters" : "Filters"}
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div
          className={cn(
            "w-full shrink-0 lg:sticky lg:top-24 lg:w-[280px]",
            mobileFiltersOpen ? "block" : "hidden lg:block",
          )}
        >
          {sidebar}
        </div>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <p className="text-base font-semibold text-gray-900">
                No products match these filters
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting brand or availability.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedBrands([]);
                  setAvailability({ inStock: false, outOfStock: false });
                }}
                className="mt-4 cursor-pointer text-sm font-semibold text-[#00498e] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <StoreProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
