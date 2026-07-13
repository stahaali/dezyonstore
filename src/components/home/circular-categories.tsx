"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { quickCategories } from "@/data/home";
import { cn } from "@/lib/utils";

export function CircularCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="border-b border-gray-200 bg-white py-8 md:py-10">
      <div className="mx-auto max-w-[1400px] px-4">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-5 md:gap-6">
            {quickCategories.map((cat) => (
              <div
                key={cat.id}
                className="min-w-0 flex-[0_0_calc(25%-15px)] sm:flex-[0_0_calc(20%-19px)] md:flex-[0_0_calc(16.666%-20px)] lg:flex-[0_0_calc(12.5%-21px)]"
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center"
                >
                  <div className="relative flex aspect-square w-full max-w-[120px] items-center justify-center overflow-hidden rounded-full bg-[#ececec] transition-colors group-hover:bg-[#e4e4e4]">
                    <div className="relative h-[72%] w-[72%]">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        sizes="120px"
                      />
                    </div>
                  </div>
                  <span className="mt-3 text-center text-xs font-bold leading-snug text-gray-900 md:text-sm">
                    {cat.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {scrollSnaps.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === selectedIndex ? "bg-gray-800" : "bg-gray-300",
                )}
                aria-label={`Go to category page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
