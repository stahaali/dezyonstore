import manifest from "./site-assets.json";

export const categoryImages = manifest.categories;
export const bannerImages = manifest.banners;
export const productImages = manifest.products;
export const siteLogo = manifest.logo || "/assets/images/optimized/dezyon-logo010.webp";

/** Skip early logo assets in the product list */
const PRODUCT_OFFSET = 30;

let imageCursor = PRODUCT_OFFSET;

export function nextProductImage(): string {
  const url =
    productImages[imageCursor] ??
    productImages[PRODUCT_OFFSET] ??
    "/assets/images/optimized/products/product-031.webp";
  imageCursor += 1;
  return url;
}

export function getProductImageAt(index: number): string {
  return (
    productImages[PRODUCT_OFFSET + index] ??
    productImages[PRODUCT_OFFSET] ??
    "/assets/images/optimized/products/product-031.webp"
  );
}
