import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryCatalog } from "@/components/category/category-catalog";
import { getCategoryBySlug } from "@/data/categories";
import {
  getProductsByCategorySlug,
  laptopProducts,
  desktopProducts,
  serverProducts,
  gamingPcProducts,
  gamingAccessoryProducts,
  peripheralProducts,
  razerProducts,
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

function resolveCategoryProducts(slug: string) {
  if (slug === "laptops") return laptopProducts;
  if (slug === "desktop-pcs") return desktopProducts;
  if (slug === "servers") return serverProducts;
  if (slug === "gaming-pcs") return gamingPcProducts;
  if (slug === "gaming-accessories") return gamingAccessoryProducts;
  if (slug === "peripherals") return peripheralProducts;
  if (slug === "razer-products") return razerProducts;
  // Never fall back to loose slug match for GA/PE (already handled above)
  return getProductsByCategorySlug(slug);
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const items = resolveCategoryProducts(slug);

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:py-8">
          <Breadcrumbs items={[{ label: category.name }]} />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {category.name}
          </h1>
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
          <CategoryCatalog
            categoryName={category.name}
            products={items}
            showTypeFilters={slug === "razer-products"}
            brandAsCategories={slug === "peripherals"}
            hideBrandCategories={
              slug === "peripherals"
                ? ["Chair", "Desk", "Console", "Controller"]
                : []
            }
            hideBrandFilter={slug === "razer-products"}
          />
        )}
      </div>
    </div>
  );
}
