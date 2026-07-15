"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Minus } from "lucide-react";
import type { Product } from "@/types";
import {
  CatalogViewSortBar,
  type CatalogSortOption,
} from "@/components/category/catalog-view-sort-bar";
import { ProductLoadMoreList } from "@/components/product/product-load-more-list";
import { cn } from "@/lib/utils";

type Facet = { name: string; count: number };

interface CategoryCatalogProps {
  categoryName: string;
  products: Product[];
  /** When true (e.g. Razer), show product-type options under Category */
  showTypeFilters?: boolean;
  /** Gaming Accessories: Category section shows type options (Controller, Chair, …) */
  showPeripheralCategoryFilters?: boolean;
  /** Peripherals page: Brand section shows type categories instead of brands */
  brandAsCategories?: boolean;
  /** Hide these Brand / category type options */
  hideBrandCategories?: string[];
  /** Hide Brand filter section (e.g. Razer Accessories — all same brand) */
  hideBrandFilter?: boolean;
}

const PERIPHERAL_CATEGORIES = [
  "Keyboard",
  "Mouse",
  "Headphone",
  "Gaming Mouse",
  "Webcam",
  "Mouse Pad",
  "Controller",
  "Chair",
  "Desk",
  "Console",
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

/** Razer.com Category facets — inspired by https://www.razer.com/search/chair */
export const RAZER_CATEGORIES = [
  "Chairs",
  "Gaming Chairs",
  "Accessories",
  "PC",
  "Mice",
  "Laptop accessories",
  "PC Accessories",
] as const;

export type RazerCategory = (typeof RAZER_CATEGORIES)[number];

/** Multi-label categories (Razer search facets can overlap) */
export function getRazerCategories(product: Product): RazerCategory[] {
  const t =
    `${product.name} ${product.slug} ${product.shortDescription}`.toLowerCase();
  const cats = new Set<RazerCategory>();

  const isChairAccessory =
    /\b(clio|freyja|caster studs|chair caster|haptic.*cushion|speaker head cushion)\b/.test(
      t,
    );
  const isGamingChair =
    !isChairAccessory &&
    (/\b(iskur|enki|fujin|soma)\b/.test(t) ||
      (/\bchair\b/.test(t) && /\b(gaming|ergonomic|mesh)\b/.test(t)));

  if (isGamingChair) {
    cats.add("Chairs");
    cats.add("Gaming Chairs");
  }
  if (isChairAccessory) {
    cats.add("Chairs");
    cats.add("Accessories");
  }
  if (
    /\b(deathadder|viper|basilisk|orochi|cobra|katar)\b/.test(t) ||
    (/\b(mouse|mice)\b/.test(t) && !/\bpad\b/.test(t) && !/\bcombo\b/.test(t))
  ) {
    cats.add("Mice");
  }
  if (/\b(blade|laptop|notebook)\b/.test(t)) {
    cats.add("PC");
  }
  if (
    /\b(laptop\s*sleeve|laptop\s*bag|laptop\s*stand|laptop\s*dock|usb.?c hub|thunderbolt)\b/.test(
      t,
    )
  ) {
    cats.add("Laptop accessories");
  }
  if (
    /\b(keyboard|blackwidow|huntsman|ornata|headset|kraken|blackshark|seiren|mic|microphone)\b/.test(
      t,
    )
  ) {
    cats.add("PC Accessories");
    cats.add("Accessories");
  }
  if (/\b(mouse\s*pad|desk mat)\b/.test(t)) {
    cats.add("PC Accessories");
    cats.add("Accessories");
  }

  return RAZER_CATEGORIES.filter((c) => cats.has(c));
}

/** Infer storefront type from name/slug — used for Razer / GA category options */
export function getProductType(product: Product): string {
  // Prefer Razer facet labels when this is a Razer Accessories product
  if (product.categorySlug === "razer-products") {
    const razer = getRazerCategories(product);
    if (razer.length > 0) return razer[0];
  }

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
  if (
    /\b(mouse|mice|mx master|magic mouse|optical mouse|trackball|air mouse)\b/.test(
      t,
    ) &&
    !/\bcombo\b/.test(t)
  ) {
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

  if (
    /\b(gaming chair|office gaming chair|dxracer|andaseat|arozzi|recliner)\b/.test(
      t,
    ) ||
    (/\bchair\b/.test(t) && /\b(gaming|ergonomic)\b/.test(t))
  ) {
    return "Chair";
  }
  if (
    /\b(gaming desk|sit-stand desk|standing desk|electric desk|l-shaped)\b/.test(
      t,
    ) ||
    (/\bdesk\b/.test(t) && /\b(gaming|motorized|rgb)\b/.test(t))
  ) {
    return "Desk";
  }
  if (
    /\b(nintendo switch|gaming console|steam deck|switch lite|switch oled|playstation|xbox series)\b/.test(
      t,
    )
  ) {
    return "Console";
  }
  if (
    /\b(gamepad|controller|joystick|racing wheel|steering wheel|fight stick|arcade|dualsense|dualshock|8bitdo|pxn|easysmx)\b/.test(
      t,
    )
  ) {
    return "Controller";
  }
  if (/\b(mouse\s*pad|desk mat|mm700|pluto|mp-75)\b/.test(t)) {
    return "Mouse Pad";
  }
  if (
    /\b(webcam|web\s*cam|c920|c270|c922|c925|brio|streamcam|pk-810|pk-910|pk-925|pk-980|camera)\b/.test(
      t,
    )
  ) {
    return "Webcam";
  }
  if (
    /\b(gaming\s*mouse|deathadder|viper|basilisk|orochi|cobra|katar|g502|g203|g pro|bloody\s*v8|m930|aerox|rival|pulsefire|model\s*[od]|attack\s*shark|glorious|eweadn|prime wireless|saber)\b/.test(
      t,
    )
  ) {
    return "Gaming Mouse";
  }
  if (
    /\b(headset|headphone|headphones|earphones|earbuds?|buds|soundcore|kraken|blackshark|cloud|stinger|arctis|bowie|evolve)\b/.test(
      t,
    )
  ) {
    return "Headphone";
  }
  if (
    /\b(keyboard|keyboards|blackwidow|huntsman|ornata|kumara|g213|pop keys|mx keys|g613|k70|vajra|fstyler|mk220|mk235|mk240|mk275|mk345|apex|pebble|pro x tkl|aula|a4tech|a4 tech|madlions|k120|kr-85)\b/.test(
      t,
    )
  ) {
    return "Keyboard";
  }
  if (
    /\b(mouse|mice|mx master|magic mouse|optical mouse|trackball|air mouse)\b/.test(
      t,
    ) &&
    !/\bcombo\b/.test(t)
  ) {
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

function buildTypeFacets(products: Product[], razerMode = false): Facet[] {
  if (razerMode) {
    const map = new Map<string, number>();
    for (const name of RAZER_CATEGORIES) map.set(name, 0);
    for (const p of products) {
      for (const cat of getRazerCategories(p)) {
        map.set(cat, (map.get(cat) ?? 0) + 1);
      }
    }
    return RAZER_CATEGORIES.map((name) => ({
      name,
      count: map.get(name) ?? 0,
    })).filter((f) => f.count > 0);
  }

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
  showPeripheralCategoryFilters = false,
  brandAsCategories = false,
  hideBrandCategories = [],
  hideBrandFilter = false,
}: CategoryCatalogProps) {
  const brandFacets = useMemo(() => buildBrandFacets(products), [products]);
  const typeFacets = useMemo(
    () => buildTypeFacets(products, showTypeFilters),
    [products, showTypeFilters],
  );
  const peripheralFacets = useMemo(
    () => buildPeripheralCategoryFacets(products, hideBrandCategories),
    [products, hideBrandCategories],
  );
  const useTypes = showTypeFilters && typeFacets.length > 0;
  const usePeripheralCategories =
    showPeripheralCategoryFilters && peripheralFacets.some((f) => f.count > 0);
  const brandSectionFacets = brandAsCategories ? peripheralFacets : brandFacets;
  const categorySectionFacets = usePeripheralCategories
    ? peripheralFacets.filter((f) => f.count > 0)
    : typeFacets;

  const inStockCount = products.length;

  const [open, setOpen] = useState({
    category: true,
    brand: true,
    availability: true,
  });

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [availability, setAvailability] = useState<{
    inStock: boolean;
  }>({ inStock: false });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<CatalogSortOption>("Relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  function toggleType(name: string) {
    setSelectedTypes((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  }

  function toggleCategory(name: string) {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  }

  function toggleBrand(name: string) {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name],
    );
  }

  function clearFilters() {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setAvailability({ inStock: false });
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedTypes.length > 0) {
        if (showTypeFilters) {
          const cats = getRazerCategories(p);
          if (!selectedTypes.some((t) => cats.includes(t as RazerCategory))) {
            return false;
          }
        } else if (!selectedTypes.includes(getProductType(p))) {
          return false;
        }
      }
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(getPeripheralCategory(p))
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
      // Availability filter removed Out of Stock — all products are in stock
      return true;
    });
  }, [
    products,
    selectedTypes,
    selectedCategories,
    selectedBrands,
    brandAsCategories,
    showTypeFilters,
  ]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "Price Low - High":
        return list.sort((a, b) => a.price - b.price);
      case "Price High - Low":
        return list.sort((a, b) => b.price - a.price);
      case "Popularity":
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case "A - Z":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "Z - A":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "Highest Rated":
        return list.sort(
          (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
        );
      case "Recently Added":
        return list.sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || ""),
        );
      case "Relevance":
      default:
        return list;
    }
  }, [filtered, sortBy]);

  const toolbar = (
    <CatalogViewSortBar
      sortBy={sortBy}
      onSortChange={setSortBy}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  );

  const sidebar = (
    <aside className="overflow-hidden rounded-xl border border-gray-200 bg-[#f2f2f2]">
      <FilterSection
        title="Category"
        open={open.category}
        onToggle={() => setOpen((s) => ({ ...s, category: !s.category }))}
      >
        {usePeripheralCategories ? (
          <ul className="space-y-2.5">
            {categorySectionFacets.map((item) => (
              <li key={item.name}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(item.name)}
                    onChange={() => toggleCategory(item.name)}
                    className="h-4 w-4 rounded border-gray-400 accent-gray-900"
                  />
                  <span>
                    {item.name} ({item.count})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : useTypes ? (
          <ul className="space-y-2.5">
            {categorySectionFacets.map((type) => (
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

      {hideBrandFilter ? null : (
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
      )}

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
          {toolbar}
          {sorted.length === 0 ? (
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
            <ProductLoadMoreList products={sorted} viewMode={viewMode} />
          )}
        </div>
      </div>
    </div>
  );
}
