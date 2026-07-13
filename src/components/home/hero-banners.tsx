"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
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
    id: "monitors",
    overline: "See Every Detail",
    title: "Stunning Displays for Work & Play",
    description:
      "From gaming to professional editing — find monitors with vibrant color and smooth refresh rates.",
    cta: "Shop Monitors",
    href: "/categories/monitors",
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
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 lg:grid-cols-3">
        {/* Main carousel — 2/3 width */}
        <div className="relative overflow-hidden rounded-3xl lg:col-span-2 lg:row-span-2">
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

        {/* Top right — Used Laptops */}
        <Link
          href="/categories/laptops"
          className="group relative flex h-full min-h-[188px] w-full items-center overflow-hidden rounded-3xl bg-[#b8d1f5]"
        >
          {/* Full-bleed blue always covers the div */}
          <div className="absolute inset-0 bg-[#b8d1f5]" aria-hidden />

          {/* Large laptop on the right */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[72%] sm:w-[68%]">
            <Image
              src={bannerImages.combo ?? bannerImages["laptop-cutout"]}
              alt=""
              fill
              className="object-contain object-right-bottom transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="320px"
            />
          </div>

          {/* Text card */}
          <div className="relative z-10 ml-3 my-3 w-[52%] max-w-[210px] rounded-[20px] bg-[#e6f0ff] px-4 py-4 shadow-sm md:ml-4 md:px-5 md:py-5">
            <p className="text-[12px] font-medium text-gray-600 md:text-[13px]">
              Tested. Trusted.
            </p>
            <p className="mt-1 text-[17px] font-bold leading-tight text-[#1a1a1a] md:text-[19px]">
              Used Laptops
            </p>
            <p className="mt-2 text-[11px] leading-snug text-gray-700 md:text-[12px]">
              Ready to Work
            </p>
            <p className="text-[11px] leading-snug text-gray-700 md:text-[12px]">
              at Unbeatable Prices
            </p>
            <span className="mt-3 inline-flex rounded-full bg-[#142846] px-5 py-2 text-[11px] font-bold text-white transition-colors group-hover:bg-[#0f1f38] md:text-[12px]">
              See Offers
            </span>
          </div>
        </Link>

        {/* Bottom right — Steelseries */}
        <Link
          href="/categories/gaming"
          className="group relative block h-full min-h-[188px] w-full overflow-hidden rounded-3xl bg-[#d8e5f8]"
        >
          {/* Actual banner background — fills whole div */}
          <Image
            src={
              bannerImages["steelseries-bg"] ??
              bannerImages["steelseries-banner"] ??
              bannerImages["steelseries-products"]
            }
            alt="Steelseries gaming peripherals"
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 460px"
          />

          {/* Buy Now button — separate HTML layer */}
          <span className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#142846] px-5 py-2.5 text-[12px] font-bold text-white shadow-sm transition-colors group-hover:bg-[#0f1f38] md:bottom-5 md:left-5 md:text-[13px]">
            Buy Now
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </span>
        </Link>
      </div>
    </section>
  );
}
