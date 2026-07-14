import {
  categoryImages,
  productImages,
  nextProductImage,
} from "@/data/site-assets";

const categoryFallback: Record<string, string> = {
  laptops: categoryImages.laptops,
  "graphic-cards": categoryImages.cooling,
  processors: categoryImages.processors,
  "gaming-accessories": categoryImages.keyboards,
  monitors: categoryImages.keyboards,
  keyboards: categoryImages.keyboards,
  mouse: categoryImages.keyboards,
  "desktop-pcs": categoryImages.cooling,
  ssd: categoryImages.cooling,
  ram: categoryImages.processors,
  gaming: categoryImages["gaming-furniture"],
  networking: categoryImages.cooling,
  accessories: categoryImages.headsets,
};

const defaultImage = categoryImages.headsets;

const seedOverrides: Record<string, number> = {
  probook: 31,
  rtx4070: 32,
  i7cpu: 33,
  monitor32: 34,
  mechkb: 35,
  mouse: 36,
  desktop: 37,
  ssd1tb: 38,
  ram32: 39,
  streamline: 40,
  chair: 41,
  router: 42,
  mon1: 43,
  mon2: 44,
  mon3: 45,
  mon4: 46,
  chair1: 47,
  chair2: 48,
  chair3: 49,
  chair4: 50,
  chair5: 51,
  chair6: 52,
  chair7: 53,
  case1: 54,
  case2: 55,
  case3: 56,
  case4: 57,
};

export function getProductImageUrl(seed: string, categorySlug?: string): string {
  const idx = seedOverrides[seed.replace(/-2$/, "")];
  if (idx !== undefined && productImages[idx]) {
    return productImages[idx];
  }
  if (categorySlug && categoryFallback[categorySlug]) {
    return categoryFallback[categorySlug];
  }
  return nextProductImage();
}
