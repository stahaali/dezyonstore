"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Minus } from "lucide-react";
import type { Product } from "@/types";
import { StoreProductCard } from "@/components/product/store-product-card";
import { cn } from "@/lib/utils";

type Facet = { name: string; count: number };

interface CategoryCatalogProps {
  categoryName: string;
  products: Product[];
  /** When true (e.g. Razer), show product-type options under Category */
  showTypeFilters?: boolean;
  /** Peripherals page: Brand section shows type categories instead of brands */
  brandAsCategories?: boolean;
  /** Hide these Brand category options (e.g. Gaming Accessories: Mouse, Webcam) */
  hideBrandCategories?: string[];
}

const PERIPHERAL_CATEGORIES = [
  "Keyboard",
  "Mouse",
  "Headphone",
  "Gaming Mouse",
  "Webcam",
  "Mouse Pad",
] as const;

type PeripheralCategory = (typeof PERIPHERAL_CATEGORIES)[number];

function buildBrandFacets(products: Product[]): Facet[] {
  const map = new Map<string, number>();
  for (const p of products) {
    map.set(p.brandName, (map.get(p.brandName) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Infer storefront type from name/slug — used for Razer / GA category options */
export function getProductType(product: Product): string {
  const t =
    `${product.name} ${product.slug} ${product.shortDescription}`.toLowerCase();

  if (/\b(mouse\s*pad|desk mat|mm700|pluto)\b/.test(t)) {
    return "Mouse Pads";
  }
  if (
    /\b(gaming\s*mouse|deathadder|viper|basilisk|orochi|cobra|katar|g502|g203|bloody\s*v8)\b/.test(
      t,
    )
  ) {
    return "Mouse";
  }
  if (/\b(mouse|mice|mx master)\b/.test(t) && !/\bcombo\b/.test(t)) {
    return "Mouse";
  }
  if (
    /\b(keyboard|blackwidow|huntsman|ornata|kumara|g213|pop keys|mx keys|g613)\b/.test(
      t,
    )
  ) {
    return "Keyboards";
  }
  if (
    /\b(headset|kraken|blackshark|cloud|stinger|arctis|headphones|headphone)\b/.test(
      t,
    )
  ) {
    return "Headsets";
  }
  if (/\b(laptop|blade|notebook)\b/.test(t)) {
    return "Laptops";
  }
  if (/\b(mic|microphone|seiren|webcam|c920|brio)\b/.test(t)) {
    return "Audio & Cameras";
  }
  if (/\b(controller|gamepad|f310)\b/.test(t)) {
    return "Controllers";
  }
  if (/\b(combo)\b/.test(t)) {
    return "Combos";
  }
  return "Other";
}

/** Peripherals Brand-section categories (as requested) */
export function getPeripheralCategory(product: Product): PeripheralCategory | "Other" {
  const t =
    `${product.name} ${product.slug} ${product.shortDescription}`.toLowerCase();

  if (/\b(mouse\s*pad|desk mat|mm700|pluto|mp-75)\b/.test(t)) {
    return "Mouse Pad";
  }
  if (/\b(webcam|c920|brio|camera)\b/.test(t)) {
    return "Webcam";
  }
  if (
    /\b(gaming\s*mouse|deathadder|viper|basilisk|orochi|cobra|katar|g502|g203|bloody\s*v8|m930)\b/.test(
      t,
    )
  ) {
    return "Gaming Mouse";
  }
  if (
    /\b(headset|headphone|kraken|blackshark|cloud|stinger|arctis|headphones)\b/.test(
      t,
    )
  ) {
    return "Headphone";
  }
  if (
    /\b(keyboard|blackwidow|huntsman|ornata|kumara|g213|pop keys|mx keys|g613|k70|vajra|fstyler|mk220)\b/.test(
      t,
    )
  ) {
    return "Keyboard";
  }
  if (/\b(mouse|mice|mx master)\b/.test(t) && !/\bcombo\b/.test(t)) {
    return "Mouse";
  }
  if (/\bcombo\b/.test(t)) {
    // Keyboard+mouse combo counts under Keyboard
    return "Keyboard";
  }
  return "Other";
}

function buildPeripheralCategoryFacets(
  products: Product[],
  hide: string[] = [],
): Facet[] {
  const map = new Map<string, number>();
  for (const name of PERIPHERAL_CATEGORIES) map.set(name, 0);
  for (const p of products) {
    const type = getPeripheralCategory(p);
    if (type === "Other") continue;
    map.set(type, (map.get(type) ?? 0) + 1);
  }
  return PERIPHERAL_CATEGORIES.filter((name) => !hide.includes(name)).map(
    (name) => ({
      name,
      count: map.get(name) ?? 0,
    }),
  );
}

function buildTypeFacets(products: Product[]): Facet[] {
  const map = new Map<string, number>();
  for (const p of products) {
    const type = getProductType(p);
    map.set(type, (map.get(type) ?? 0) + 1);
  }
  const order = [
    "Mouse",
    "Keyboards",
    "Headsets",
    "Laptops",
    "Audio & Cameras",
    "Mouse Pads",
    "Controllers",
    "Combos",
    "Other",
  ];
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const ai = order.indexOf(a.name);
      const bi = order.indexOf(b.name);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
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
  showTypeFilters = false,
  brandAsCategories = false,
  hideBrandCategories = [],
}: CategoryCatalogProps) {
  const brandFacets = useMemo(() => buildBrandFacets(products), [products]);
  const typeFacets = useMemo(() => buildTypeFacets(products), [products]);
  const peripheralFacets = useMemo(
    () => buildPeripheralCategoryFacets(products, hideBrandCategories),
    [products, hideBrandCategories],
  );
  const useTypes = showTypeFilters && typeFacets.length > 0;
  const brandSectionFacets = brandAsCategories ? peripheralFacets : brandFacets;

  const inStockCount = products.filter((p) => p.inStock).length;
  const outStockCount = products.length - inStockCount;

  const [open, setOpen] = useState({
    category: true,
    brand: true,
    availability: true,
  });

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [availability, setAvailability] = useState<{
    inStock: boolean;
    outOfStock: boolean;
  }>({ inStock: false, outOfStock: false });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  function toggleType(name: string) {
    setSelectedTypes((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  }

  function toggleBrand(name: string) {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name],
    );
  }

  function clearFilters() {
    setSelectedTypes([]);
    setSelectedBrands([]);
    setAvailability({ inStock: false, outOfStock: false });
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (
        selectedTypes.length > 0 &&
        !selectedTypes.includes(getProductType(p))
      ) {
        return false;
      }
      if (selectedBrands.length > 0) {
        if (brandAsCategories) {
          if (!selectedBrands.includes(getPeripheralCategory(p))) return false;
        } else if (!selectedBrands.includes(p.brandName)) {
          return false;
        }
      }
      if (availability.inStock || availability.outOfStock) {
        if (availability.inStock && availability.outOfStock) {
          // both checked = no filter
        } else if (availability.inStock && !p.inStock) return false;
        else if (availability.outOfStock && p.inStock) return false;
      }
      return true;
    });
  }, [products, selectedTypes, selectedBrands, availability, brandAsCategories]);

  const sidebar = (
    <aside className="overflow-hidden rounded-xl border border-gray-200 bg-[#f2f2f2]">
      <FilterSection
        title="Category"
        open={open.category}
        onToggle={() => setOpen((s) => ({ ...s, category: !s.category }))}
      >
        {useTypes ? (
          <ul className="space-y-2.5">
            {typeFacets.map((type) => (
              <li key={type.name}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.name)}
                    onChange={() => toggleType(type.name)}
                    className="h-4 w-4 rounded border-gray-400 accent-gray-900"
                  />
                  <span>
                    {type.name} ({type.count})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-medium text-gray-800">{categoryName}</p>
        )}
      </FilterSection>

      <FilterSection
        title="Brand"
        open={open.brand}
        onToggle={() => setOpen((s) => ({ ...s, brand: !s.brand }))}
      >
        <ul className="space-y-2.5">
          {brandSectionFacets.map((item) => (
            <li key={item.name}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(item.name)}
                  onChange={() => toggleBrand(item.name)}
                  className="h-4 w-4 rounded border-gray-400 accent-gray-900"
                />
                <span>
                  {item.name} ({item.count})
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
      <div className="mb-5 flex flex-wrap items-center justify-end gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900"
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
                Try adjusting category, brand, or availability.
              </p>
              <button
                type="button"
                onClick={clearFilters}
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
