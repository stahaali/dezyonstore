"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  GitCompareArrows,
  MessageCircleQuestion,
  Share2,
  Truck,
  Minus,
  Plus,
  Star,
  ChevronDown,
  X,
} from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCurrencyStore } from "@/store/currency-store";
import { formatPriceDollar } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import { alertAddedToCart, alertAlreadyInCart } from "@/lib/cart-alerts";
import { siteLogo } from "@/data/site-assets";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useRequireLoginForCart } from "@/hooks/use-require-login-for-cart";
import { ProductReviewsSection } from "@/components/product/product-reviews-section";

type Props = {
  product: Product;
  categoryName: string;
};

export function ProductDetailView({ product, categoryName }: Props) {
  const router = useRouter();
  const mounted = useHasMounted();
  const currency = useCurrencyStore((s) => s.currency);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const { ensureLoggedIn } = useRequireLoginForCart();

  const gallery = useMemo(
    () =>
      product.images.length
        ? product.images
        : [{ id: "fallback", url: siteLogo, alt: product.name }],
    [product],
  );

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"overview" | "reviews">("overview");
  const [openShipping, setOpenShipping] = useState(false);
  const [openReturns, setOpenReturns] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const imageBoxRef = useRef<HTMLDivElement>(null);

  const activeSrc = gallery[activeImage]?.url ?? siteLogo;
  const activeAlt = gallery[activeImage]?.alt ?? product.name;

  const bullets = product.shortDescription
    .split(/[—–|-]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  useEffect(() => {
    if (!lightbox) {
      setLightboxScale(1);
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  function onMainMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = imageBoxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  async function handleAddToCart() {
    const ok = await ensureLoggedIn({
      productId: product.id,
      quantity: qty,
    });
    if (!ok) return;
    const result = addItem(product, qty);
    if (result === "exists") {
      void alertAlreadyInCart(product.name);
      return;
    }
    void alertAddedToCart(product.name);
  }

  async function handleBuyNow() {
    const ok = await ensureLoggedIn({
      productId: product.id,
      quantity: qty,
      buyNow: true,
    });
    if (!ok) return;
    addItem(product, qty);
    router.push("/checkout");
  }

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:py-8">
        <div>
          <div
            ref={imageBoxRef}
            role="button"
            tabIndex={0}
            aria-label="Zoom product image"
            onMouseEnter={() => setZooming(true)}
            onMouseLeave={() => setZooming(false)}
            onMouseMove={onMainMouseMove}
            onClick={() => setLightbox(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLightbox(true);
              }
            }}
            className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-md border border-gray-200 bg-white"
          >
            <Image
              src={activeSrc}
              alt={activeAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn(
                "object-contain p-4 transition-opacity duration-150",
                zooming ? "opacity-0 lg:opacity-0" : "opacity-100",
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-0 hidden bg-white bg-no-repeat lg:block",
                zooming ? "opacity-100" : "opacity-0",
              )}
              style={{
                backgroundImage: `url(${activeSrc})`,
                backgroundSize: "220%",
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {gallery.map((img, i) => (
              <button
                key={`${img.id}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded border bg-white",
                  i === activeImage
                    ? "border-[#00498e] ring-1 ring-[#00498e]"
                    : "border-gray-200 hover:border-gray-400",
                )}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold leading-snug text-gray-900 md:text-2xl">
            {product.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <Link
              href="#reviews"
              onClick={() => setTab("reviews")}
              className="text-sm text-[#00498e] hover:underline"
            >
              {product.reviewCount > 0
                ? `${product.reviewCount} reviews`
                : "Be the first to review"}
            </Link>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          {bullets.length > 0 ? (
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-gray-800">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-bold text-gray-900 md:text-3xl">
              {formatPriceDollar(product.price, currency)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-base text-gray-400 line-through">
                {formatPriceDollar(product.compareAtPrice, currency)}
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center overflow-hidden rounded border border-gray-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="cursor-pointer px-3 py-2.5 hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                value={qty}
                onChange={(e) => {
                  const n = Number(e.target.value.replace(/\D/g, ""));
                  setQty(Number.isFinite(n) && n > 0 ? Math.min(n, 99) : 1);
                }}
                className="w-12 border-x border-gray-300 py-2 text-center text-sm font-semibold outline-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="cursor-pointer px-3 py-2.5 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:max-w-md">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full cursor-pointer rounded-md bg-[#0c2340] py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#0a1c33]"
            >
              Add To Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full cursor-pointer rounded-md bg-[#ffc107] py-3 text-sm font-bold uppercase tracking-wide text-gray-900 hover:bg-[#ffb300]"
            >
              Buy It Now
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="inline-flex cursor-pointer items-center gap-1.5 hover:text-[#00498e]"
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  mounted && wishlisted && "fill-red-500 text-red-500",
                )}
              />
              {mounted && wishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>
            <span className="inline-flex items-center gap-1.5">
              <GitCompareArrows className="h-4 w-4" />
              Compare
            </span>
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 hover:text-[#00498e]"
            >
              <MessageCircleQuestion className="h-4 w-4" />
              Ask a Question
            </a>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  void navigator.share({
                    title: product.name,
                    url: window.location.href,
                  });
                } else if (typeof navigator !== "undefined") {
                  void navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 hover:text-[#00498e]"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-md border border-gray-200 bg-[#f7f8fa] px-4 py-3 text-sm text-gray-700">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#00498e]" />
            <p>
              <span className="font-semibold">Estimated delivery:</span> 2 – 5
              days across the country.
            </p>
          </div>

          <table className="mt-5 w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="w-[40%] py-2.5 font-semibold text-gray-600">
                  Availability
                </td>
                <td className="py-2.5 font-semibold text-green-600">
                  In Stock
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2.5 font-semibold text-gray-600">SKU</td>
                <td className="py-2.5 text-gray-900">{product.id.toUpperCase()}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2.5 font-semibold text-gray-600">Brand</td>
                <td className="py-2.5 text-gray-900">{product.brandName}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2.5 font-semibold text-gray-600">Categories</td>
                <td className="py-2.5">
                  <Link
                    href={`/categories/${product.categorySlug}`}
                    className="text-[#00498e] hover:underline"
                  >
                    {categoryName}
                  </Link>
                </td>
              </tr>
              {product.specs.map((spec) => (
                <tr key={spec.label} className="border-b border-gray-200">
                  <td className="py-2.5 font-semibold text-gray-600">
                    {spec.label}
                  </td>
                  <td className="py-2.5 text-gray-900">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOpenShipping((v) => !v)}
              className="flex w-full cursor-pointer items-center justify-between py-3 text-left text-sm font-semibold text-gray-900"
            >
              Shipping and Returns
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openShipping && "rotate-180",
                )}
              />
            </button>
            {openShipping ? (
              <p className="pb-3 text-sm text-gray-600">
                Orders usually ship within 1 business day. Standard delivery is
                2–5 days. Free shipping on orders over $100.
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setOpenReturns((v) => !v)}
              className="flex w-full cursor-pointer items-center justify-between border-t border-gray-200 py-3 text-left text-sm font-semibold text-gray-900"
            >
              Return and Exchange Policy
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openReturns && "rotate-180",
                )}
              />
            </button>
            {openReturns ? (
              <p className="pb-3 text-sm text-gray-600">
                Unused products in original packaging can be returned within 7
                days. Opened software and licenses are non-returnable.{" "}
                <Link
                  href="/return-exchange"
                  className="font-medium text-[#00498e] hover:underline"
                >
                  View full Return & Exchange policy
                </Link>
                .
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div id="reviews" className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="flex gap-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setTab("overview")}
              className={cn(
                "cursor-pointer border-b-2 py-3 text-sm font-bold",
                tab === "overview"
                  ? "border-[#00498e] text-[#00498e]"
                  : "border-transparent text-gray-500",
              )}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setTab("reviews")}
              className={cn(
                "cursor-pointer border-b-2 py-3 text-sm font-bold",
                tab === "reviews"
                  ? "border-[#00498e] text-[#00498e]"
                  : "border-transparent text-gray-500",
              )}
            >
              Reviews
            </button>
          </div>

          <div className="py-8">
            {tab === "overview" ? (
              <div className="max-w-3xl">
                <h2 className="text-lg font-bold text-gray-900">
                  Product Features
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
                {product.specs.length > 0 ? (
                  <div className="mt-6 overflow-hidden rounded-md border border-gray-200">
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specs.map((spec, i) => (
                          <tr
                            key={spec.label}
                            className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                          >
                            <td className="w-1/3 px-4 py-2.5 font-semibold text-gray-700">
                              {spec.label}
                            </td>
                            <td className="px-4 py-2.5 text-gray-800">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            ) : (
              <ProductReviewsSection product={product} />
            )}
          </div>
        </div>
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setLightboxScale((s) =>
                    Math.max(1, Number((s - 0.5).toFixed(1))),
                  )
                }
                className="cursor-pointer rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
              >
                −
              </button>
              <span className="min-w-[3rem] text-center text-xs">
                {Math.round(lightboxScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() =>
                  setLightboxScale((s) =>
                    Math.min(3, Number((s + 0.5).toFixed(1))),
                  )
                }
                className="cursor-pointer rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Close zoom"
                onClick={() => setLightbox(false)}
                className="cursor-pointer rounded-md bg-white/10 p-2 hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div
            className="flex flex-1 items-center justify-center overflow-auto p-4"
            onClick={() => setLightbox(false)}
          >
            <div
              className="relative h-full max-h-[85vh] w-full max-w-5xl transition-transform duration-200"
              style={{ transform: `scale(${lightboxScale})` }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeSrc}
                alt={activeAlt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
