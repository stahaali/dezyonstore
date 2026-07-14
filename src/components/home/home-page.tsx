"use client";

import { useEffect } from "react";
import { HeroBanners } from "@/components/home/hero-banners";
import { CircularCategories } from "@/components/home/circular-categories";
import { ProductGridSection } from "@/components/home/product-grid-section";
import { CategoryCarouselSection } from "@/components/home/category-carousel-section";
import { GamingChairsSection } from "@/components/home/gaming-chairs-section";
import { BrandCarouselSection } from "@/components/home/brand-carousel-section";
import { AnnouncementTicker } from "@/components/home/announcement-ticker";
import { NewsletterSection } from "@/components/home/newsletter-section";
import {
  featuredProductsHome,
  desktopsHome,
  serversHome,
  gamingAccessoriesHome,
  gamingChairsHome,
  gamingAccessoriesNavHome,
} from "@/data/products";

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomePage() {
  useEffect(() => {
    if (window.location.hash) {
      // Wait for layout / sticky header before scrolling
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }

    const onHashChange = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <HeroBanners />
      <CircularCategories />

      <ProductGridSection
        id="laptops"
        title="Laptops"
        products={featuredProductsHome}
      />

      <ProductGridSection
        id="desktops"
        title="LCDs"
        products={desktopsHome}
        viewAllHref="/categories/desktop-pcs"
      />

      <ProductGridSection
        id="servers"
        title="Servers"
        products={serversHome}
        viewAllHref="/categories/servers"
        columns={5}
      />

      <GamingChairsSection products={gamingChairsHome} />

      <BrandCarouselSection
        id="gaming-accessories"
        title="Gaming Accessories"
        subtitle="Mice, keyboards, headsets & gear — inspired by CZone."
        products={gamingAccessoriesNavHome}
        viewAllHref="/categories/gaming-accessories"
      />

      <CategoryCarouselSection
        id="peripherals"
        title="Peripherals"
        subtitle="Keyboards, mice, headsets and more for gamers"
        products={gamingAccessoriesHome}
        viewAllHref="/categories/peripherals"
      />

      <AnnouncementTicker />
      <NewsletterSection />
    </>
  );
}
