export const SITE_NAME = "Dezyon Store";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dezyon.store";
export const SITE_DESCRIPTION =
  "Premium computer hardware, gaming gear, and electronics — laptops, GPUs, components, and accessories.";

export const ACCENT_COLOR = "#89c43a";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "Contact", href: "/contact" },
] as const;

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Best Rating", value: "rating" },
] as const;
