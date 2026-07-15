import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/home/section-header";
import { ProductSortToolbar } from "@/components/product/product-sort-toolbar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { products } from "@/data/products";
import { filterProductsByQuery } from "@/lib/search-products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all computer hardware, gaming gear and electronics.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const results = filterProductsByQuery(products, query);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Products", href: query ? "/products" : undefined },
          ...(query ? [{ label: `Search: ${query}` }] : []),
        ]}
      />
      <SectionHeader
        label="Shop"
        title={query ? `Results for “${query}”` : "All Products"}
        description={
          query
            ? "Matching products from our catalog."
            : "Discover laptops, desktops, servers, gaming PCs and more."
        }
        className="mt-4"
      />

      {results.length === 0 ? (
        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
          <p className="text-base font-semibold text-gray-900">
            No products found for “{query}”
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Try a different keyword, brand, or category.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-[#0c2340] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1c33]"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <ProductSortToolbar products={results} />
        </div>
      )}
    </div>
  );
}
