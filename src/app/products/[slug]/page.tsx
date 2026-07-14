import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductDetailView } from "@/components/product/product-detail";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug, products } from "@/data/products";
import { SITE_NAME } from "@/lib/constants";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const categoryName = category?.name ?? product.categorySlug;

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1400px] px-4 py-4">
          <Breadcrumbs
            items={[
              {
                label: categoryName,
                href: `/categories/${product.categorySlug}`,
              },
              { label: product.brandName },
              { label: product.name },
            ]}
          />
        </div>
      </div>
      <ProductDetailView product={product} categoryName={categoryName} />
      <p className="sr-only">
        {product.name} at {SITE_NAME}
      </p>
    </div>
  );
}
