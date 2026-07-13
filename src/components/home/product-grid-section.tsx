import Link from "next/link";
import type { Product } from "@/types";
import { StoreProductCard } from "@/components/product/store-product-card";
import { cn } from "@/lib/utils";

interface ProductGridSectionProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  columns?: 4 | 5;
  id?: string;
}

export function ProductGridSection({
  title,
  products,
  viewAllHref,
  viewAllLabel = "View All",
  className,
  columns = 5,
  id,
}: ProductGridSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-28 bg-white py-8 md:py-10 lg:scroll-mt-32", className)}
    >
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{title}</h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="shrink-0 rounded-full bg-[#ffc107] px-5 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-[#e6ad00]"
            >
              {viewAllLabel}
            </Link>
          )}
        </div>

        <div
          className={cn(
            "grid gap-6 sm:gap-8",
            columns === 5
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {products.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
