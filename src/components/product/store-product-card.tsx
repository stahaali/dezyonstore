"use client";

import { useEffect, useState } from "react";
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
import { useRequireLoginForCart } from "@/hooks/use-require-login-for-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";

interface StoreProductCardProps {
  product: Product;
  className?: string;
  layout?: "grid" | "list";
}

export function StoreProductCard({
  product,
  className,
  layout = "grid",
}: StoreProductCardProps) {
  const mounted = useHasMounted();
  const addToCart = useCartStore((s) => s.addItem);
  const inCartRaw = useCartStore((s) => s.hasItem(product.id));
  const currency = useCurrencyStore((s) => s.currency);
  const discount = calcDiscount(product.price, product.compareAtPrice);
  const inCart = mounted && inCartRaw;
  const { ensureLoggedIn } = useRequireLoginForCart();
  const [imgSrc, setImgSrc] = useState(product.images[0]?.url ?? siteLogo);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  const productImage = product.images[0]?.url ?? siteLogo;
  useEffect(() => {
    setImgSrc(productImage);
    setImageLoaded(false);
    setReady(false);
  }, [product.id, productImage]);

  useEffect(() => {
    if (!imageLoaded) return;
    const t = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(t);
  }, [imageLoaded]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setImageLoaded(true);
      setReady(true);
    }, 2500);
    return () => window.clearTimeout(t);
  }, [product.id]);

  async function handleAddToCart() {
    const ok = await ensureLoggedIn({ productId: product.id, quantity: 1 });
    if (!ok) return;
    const result = addToCart(product);
    if (result === "exists") {
      void alertAlreadyInCart(product.name);
      return;
    }
    void alertAddedToCart(product.name);
  }

  const stars = (
    <div className="flex h-3.5 shrink-0 items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-amber-400",
            i < Math.round(product.rating) ? "fill-amber-400" : "fill-none",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );

  const priceRow = (
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
  );

  const addBtn = (
    <button
      type="button"
      onClick={handleAddToCart}
      className={cn(
        "flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0c2340] text-sm font-semibold text-white transition-colors hover:bg-[#0a1c33]",
        layout === "list" ? "w-auto min-w-[140px] px-5" : "mt-auto w-full",
      )}
    >
      {inCart ? "In Cart" : "Add To Cart"}
    </button>
  );

  const productImg = (
    <Image
      src={imgSrc}
      alt={product.name}
      fill
      sizes={
        layout === "list" ? "140px" : "(max-width: 640px) 45vw, 20vw"
      }
      className={cn(
        "object-contain object-center transition-all duration-300 group-hover/image:scale-[1.03]",
        layout === "list" ? "p-2" : "p-3",
        imageLoaded ? "opacity-100" : "opacity-0",
      )}
      onLoad={() => setImageLoaded(true)}
      onError={() => {
        if (imgSrc !== siteLogo) setImgSrc(siteLogo);
        else setImageLoaded(true);
      }}
    />
  );

  if (layout === "list") {
    return (
      <div className={cn("relative", className)}>
        {!ready ? (
          <div className="absolute inset-0 z-10">
            <ProductCardSkeleton layout="list" />
          </div>
        ) : null}
        <article
          className={cn(
            "flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-3 transition-opacity duration-300 sm:flex-row sm:items-center sm:gap-5 sm:p-4",
            ready ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={!ready}
        >
          <Link
            href={`/products/${product.slug}`}
            className="group/image relative mx-auto block h-[140px] w-full max-w-[180px] shrink-0 overflow-hidden rounded-md bg-[#f0f1f3] sm:mx-0 sm:h-[120px] sm:w-[140px]"
            tabIndex={ready ? undefined : -1}
          >
            {!imageLoaded ? (
              <Skeleton className="absolute inset-0 z-[1] rounded-md" />
            ) : null}
            {productImg}
          </Link>
          <div className="min-w-0 flex-1 space-y-2">
            {stars}
            <Link href={`/products/${product.slug}`} tabIndex={ready ? undefined : -1}>
              <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-800 hover:text-[#00498e] sm:text-[15px]">
                {product.name}
              </p>
            </Link>
            <p className="line-clamp-2 text-xs text-gray-500 sm:text-sm">
              {product.shortDescription}
            </p>
            {priceRow}
          </div>
          <div className="shrink-0 sm:self-center">{addBtn}</div>
        </article>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full", className)}>
      {!ready ? (
        <div className="absolute inset-0 z-10">
          <ProductCardSkeleton layout="grid" />
        </div>
      ) : null}
      <article
        className={cn(
          "flex h-full flex-col bg-transparent transition-opacity duration-300",
          ready ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={!ready}
      >
        <Link
          href={`/products/${product.slug}`}
          className="group/image relative block h-[170px] w-full overflow-hidden rounded-md bg-[#f0f1f3] sm:h-[190px] md:h-[200px]"
          tabIndex={ready ? undefined : -1}
        >
          {!imageLoaded ? (
            <Skeleton className="absolute inset-0 z-[1] rounded-md" />
          ) : null}
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
          {productImg}
        </Link>

        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
          {stars}
          <Link
            href={`/products/${product.slug}`}
            className="block min-h-[2.5rem] shrink-0"
            tabIndex={ready ? undefined : -1}
          >
            <p className="line-clamp-2 text-sm leading-snug text-gray-800 hover:text-[#00498e]">
              {product.name}
            </p>
          </Link>
          {priceRow}
          {addBtn}
        </div>
      </article>
    </div>
  );
}
