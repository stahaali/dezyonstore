import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { bannerImages } from "@/data/site-assets";
import { StoreProductCard } from "@/components/product/store-product-card";

interface GamingChairsSectionProps {
  products: Product[];
}

export function GamingChairsSection({ products }: GamingChairsSectionProps) {
  return (
    <section
      id="gaming-pc"
      className="scroll-mt-28 bg-white py-8 md:py-10 lg:scroll-mt-32"
    >
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
              Gaming Pc
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Prebuilt gaming desktops with RTX graphics — ready to play from
              $1,899.
            </p>
          </div>
          <Link
            href="/categories/gaming-pcs"
            className="shrink-0 rounded-full bg-[#ffc107] px-5 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-[#e6ad00]"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <Link
            href="/categories/gaming-pcs"
            className="group relative mx-auto block w-full max-w-[300px] overflow-hidden rounded-2xl bg-white lg:mx-0 lg:h-full lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full lg:absolute lg:inset-0 lg:aspect-auto">
              <Image
                src={bannerImages["gaming-chair"]}
                alt="Shop Gaming PCs"
                fill
                className="border-0 object-cover object-center outline-none transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="300px"
              />
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
