import type { Product } from "@/types";

export function filterProductsByQuery(products: Product[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  return products.filter((p) => {
    const haystack = [
      p.name,
      p.brandName,
      p.shortDescription,
      p.description,
      p.categorySlug,
      p.slug,
      ...(p.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
