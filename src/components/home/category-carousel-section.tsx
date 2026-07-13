"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import type { Product } from "@/types";
import { StoreProductCard } from "@/components/product/store-product-card";
import { cn } from "@/lib/utils";

interface CategoryCarouselSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  viewAllHref: string;
  className?: string;
  id?: string;
}

export function CategoryCarouselSection({
  title,
  subtitle,
  products,
  viewAllHref,
  className,
  id,
}: CategoryCarouselSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 bg-white py-8 md:py-10 lg:scroll-mt-32",
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
          <Link
            href={viewAllHref}
            className="shrink-0 rounded-full bg-[#ffc107] px-5 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-[#e6ad00]"
          >
            View All
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50 md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4 md:gap-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="min-w-0 flex-[0_0_calc(50%-8px)] sm:flex-[0_0_calc(33.333%-14px)] lg:flex-[0_0_calc(25%-15px)]"
                >
                  <StoreProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollNext}
            className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50 md:flex"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
