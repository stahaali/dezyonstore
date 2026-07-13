export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  icon?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  productCount: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  categoryId: string;
  categorySlug: string;
  brandId: string;
  brandSlug: string;
  brandName: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  specs: ProductSpec[];
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isGaming?: boolean;
  badge?: "sale" | "new" | "hot" | "limited";
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SlideBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  accent?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  tag?: string;
}
