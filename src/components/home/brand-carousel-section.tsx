"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types";
import { StoreProductCard } from "@/components/product/store-product-card";
import { cn } from "@/lib/utils";

interface BrandCarouselSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  viewAllHref: string;
  className?: string;
  id?: string;
}

export function BrandCarouselSection({
  title,
  subtitle,
  products,
  viewAllHref,
  className,
  id,
}: BrandCarouselSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

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
            disabled={!canPrev}
            className={cn(
              "absolute left-0 top-[28%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/70 text-white shadow-md transition hover:bg-gray-500/80 md:flex",
              !canPrev && "pointer-events-none opacity-40",
            )}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div ref={emblaRef} className="overflow-hidden px-0 md:px-2">
            <div className="flex gap-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="min-w-0 flex-[0_0_calc(50%-10px)] sm:flex-[0_0_calc(33.333%-14px)] md:flex-[0_0_calc(25%-15px)] lg:flex-[0_0_calc(16.666%-17px)]"
                >
                  <StoreProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollNext}
            disabled={!canNext}
            className={cn(
              "absolute right-0 top-[28%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/70 text-white shadow-md transition hover:bg-gray-500/80 md:flex",
              !canNext && "pointer-events-none opacity-40",
            )}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
