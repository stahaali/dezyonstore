import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StoreProductCard } from "@/components/product/store-product-card";
import { getCategoryBySlug } from "@/data/categories";
import {
  getProductsByCategorySlug,
  laptopProducts,
  desktopProducts,
  serverProducts,
  gamingPcProducts,
  gamingAccessoryProducts,
  peripheralProducts,
} from "@/data/products";
import { SITE_NAME } from "@/lib/constants";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category" };
  }
  return {
    title: category.name,
    description: category.description || `Shop ${category.name} at ${SITE_NAME}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const items =
    slug === "laptops"
      ? laptopProducts
      : slug === "desktop-pcs"
        ? desktopProducts
        : slug === "servers"
          ? serverProducts
          : slug === "gaming-pcs"
            ? gamingPcProducts
            : slug === "gaming-accessories"
              ? gamingAccessoryProducts
              : slug === "peripherals"
                ? peripheralProducts
                : getProductsByCategorySlug(slug);

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:py-8">
          <Breadcrumbs items={[{ label: category.name }]} />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {category.name}
          </h1>
          <p className="mt-3 text-sm font-medium text-gray-500">
            {items.length} result{items.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8">
        {items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <p className="text-base font-semibold text-gray-900">
              No products in this category yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Check back soon or browse other categories from the menu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
