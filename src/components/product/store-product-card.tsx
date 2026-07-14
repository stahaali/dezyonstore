"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { calcDiscount, cn } from "@/lib/utils";
import { formatPriceDollar } from "@/lib/format-price";
import { useCurrencyStore } from "@/store/currency-store";
import { siteLogo } from "@/data/site-assets";
import { alertAddedToCart, alertAlreadyInCart } from "@/lib/cart-alerts";
import { useHasMounted } from "@/hooks/use-has-mounted";

interface StoreProductCardProps {
  product: Product;
  className?: string;
}

export function StoreProductCard({ product, className }: StoreProductCardProps) {
  const mounted = useHasMounted();
  const addToCart = useCartStore((s) => s.addItem);
  const inCartRaw = useCartStore((s) => s.hasItem(product.id));
  const currency = useCurrencyStore((s) => s.currency);
  const discount = calcDiscount(product.price, product.compareAtPrice);
  const inCart = mounted && inCartRaw;

  function handleAddToCart() {
    if (!product.inStock) return;
    const result = addToCart(product);
    if (result === "exists") {
      void alertAlreadyInCart(product.name);
      return;
    }
    void alertAddedToCart(product.name);
  }

  return (
    <article className={cn("flex h-full flex-col bg-transparent", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="group/image relative block h-[170px] w-full overflow-hidden rounded-md bg-white sm:h-[190px] md:h-[200px]"
      >
        {discount > 0 || product.isNew ? (
          <div className="absolute left-0 top-0 z-10 flex flex-col gap-1">
            {product.isNew ? (
              <span className="rounded-sm bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                New
              </span>
            ) : null}
            {discount > 0 ? (
              <span className="rounded-sm bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                {discount}% Off
              </span>
            ) : null}
          </div>
        ) : null}
        <Image
          src={product.images[0]?.url ?? siteLogo}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 45vw, 20vw"
          className="object-contain object-center p-3 transition-transform duration-300 group-hover/image:scale-[1.03]"
        />
      </Link>

      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex h-3.5 shrink-0 items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-amber-400",
                i < Math.round(product.rating)
                  ? "fill-amber-400"
                  : "fill-none",
              )}
              strokeWidth={1.5}
            />
          ))}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="block min-h-[2.5rem] shrink-0"
        >
          <p className="line-clamp-2 text-sm leading-snug text-gray-800 hover:text-[#00498e]">
            {product.shortDescription || product.name}
          </p>
        </Link>

        <div className="flex min-h-[1.5rem] shrink-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-bold leading-none text-gray-900">
            {formatPriceDollar(product.price, currency)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm font-normal leading-none text-gray-400 line-through">
              {formatPriceDollar(product.compareAtPrice, currency)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          disabled={!product.inStock}
          onClick={handleAddToCart}
          className={cn(
            "mt-auto flex h-10 w-full shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white transition-colors",
            product.inStock
              ? "cursor-pointer bg-[#0c2340] hover:bg-[#0a1c33]"
              : "cursor-not-allowed bg-gray-400",
          )}
        >
          {!product.inStock
            ? "Out Of Stock"
            : inCart
              ? "In Cart"
              : "Add To Cart"}
        </button>
      </div>
    </article>
  );
}
