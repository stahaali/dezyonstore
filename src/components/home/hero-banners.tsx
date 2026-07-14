"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { bannerImages } from "@/data/site-assets";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: "headphones",
    overline: "Hear the Difference",
    title: "Immerse Yourself in Pure Sound",
    description:
      "Experience rich, detailed audio with premium headphones built for music lovers and creators.",
    cta: "Shop Headphones",
    href: "/categories/accessories",
    image: bannerImages["hero-headphones"] ?? bannerImages["hero-model"],
  },
  {
    id: "gaming-accessories",
    overline: "Level Up Your Rig",
    title: "Gaming Accessories That Win",
    description:
      "Keyboards, mice, headsets and more — gear up like the pros with CZone-inspired gaming accessories.",
    cta: "Shop Accessories",
    href: "/categories/gaming-accessories",
    image: bannerImages["hero-monitors"] ?? bannerImages.main,
  },
  {
    id: "sony",
    overline: "Premium Audio",
    title: "Sound That Moves You",
    description:
      "Discover Sony headphones and speakers engineered for clarity, comfort, and all-day listening.",
    cta: "Explore Audio",
    href: "/categories/accessories",
    image: bannerImages["hero-sony"] ?? bannerImages.slider,
  },
  {
    id: "gaming",
    overline: "Level Up Your Setup",
    title: "Gear Up for Victory",
    description:
      "Keyboards, mice, and headsets from top brands — built for competitive gaming and marathon sessions.",
    cta: "Shop Gaming",
    href: "/categories/gaming",
    image: bannerImages["hero-gaming"] ?? bannerImages.slider,
  },
] as const;

export function HeroBanners() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(interval);
    };
  }, [emblaApi]);

  return (
    <section
      className="scroll-mt-28 bg-white py-4 md:py-6 lg:scroll-mt-32"
      id="homebanner"
    >
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="relative overflow-hidden rounded-3xl">
          <div ref={emblaRef} className="h-full overflow-hidden">
            <div className="flex h-full">
              {heroSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="relative min-w-0 flex-[0_0_100%]"
                >
                  <div className="relative flex min-h-[300px] items-center overflow-hidden bg-[radial-gradient(circle_at_72%_50%,#ffffff_0%,#f3f3f3_38%,#ebebeb_100%)] md:min-h-[380px] lg:min-h-[400px]">
                    <div className="relative z-10 flex max-w-[52%] flex-col px-6 py-8 md:px-10 md:py-10">
                      <p className="text-sm font-medium text-gray-600 md:text-base">
                        {slide.overline}
                      </p>
                      <h2 className="mt-2 text-2xl font-extrabold leading-[1.15] text-gray-900 md:text-4xl lg:text-[2.65rem]">
                        {slide.title}
                      </h2>
                      <p className="mt-3 hidden text-sm leading-relaxed text-gray-500 sm:block md:text-base">
                        {slide.description}
                      </p>
                      <Link
                        href={slide.href}
                        className="mt-5 inline-flex w-fit rounded-full bg-[#0c2340] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0a1c33] md:px-7 md:py-3"
                      >
                        {slide.cta}
                      </Link>
                    </div>

                    <div className="absolute right-[4%] top-1/2 aspect-square h-[78%] max-h-[320px] -translate-y-1/2 overflow-hidden rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:right-[6%] md:h-[82%] md:max-h-[360px]">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className={cn(
                          "object-cover",
                          slide.id === "headphones"
                            ? "object-[72%_center]"
                            : "object-center",
                        )}
                        sizes="(max-width: 1024px) 45vw, 30vw"
                        priority={slide.id === "headphones"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === selected ? "bg-gray-800" : "bg-gray-400/70",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
