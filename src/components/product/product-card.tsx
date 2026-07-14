"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, GitCompareArrows } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/product/rating-stars";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";
import { calcDiscount, cn, formatPrice } from "@/lib/utils";
import { alertAddedToCart, alertAlreadyInCart } from "@/lib/cart-alerts";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useRequireLoginForCart } from "@/hooks/use-require-login-for-cart";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const mounted = useHasMounted();
  const addToCart = useCartStore((s) => s.addItem);
  const inCartRaw = useCartStore((s) => s.hasItem(product.id));
  const inCart = mounted && inCartRaw;
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlistedRaw = useWishlistStore((s) => s.has(product.id));
  const isWishlisted = mounted && isWishlistedRaw;
  const addCompare = useCompareStore((s) => s.add);
  const discount = calcDiscount(product.price, product.compareAtPrice);
  const { ensureLoggedIn } = useRequireLoginForCart();

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    const ok = await ensureLoggedIn({ productId: product.id, quantity: 1 });
    if (!ok) return;
    const result = addToCart(product);
    if (result === "exists") {
      void alertAlreadyInCart(product.name);
      return;
    }
    void alertAddedToCart(product.name);
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        {product.badge && (
          <Badge
            variant={product.badge === "sale" ? "sale" : product.badge}
            className="absolute left-3 top-3 z-10"
          >
            {product.badge === "sale" && discount > 0 ? `-${discount}%` : product.badge}
          </Badge>
        )}
        <Image
          src={product.images[0]?.url ?? "/assets/images/logo.webp"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {inCart ? "In Cart" : "Add"}
          </Button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brandName}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-semibold leading-snug text-foreground transition-colors hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <RatingStars rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-accent">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Wishlist"
              onClick={() => {
                toggleWishlist(product);
                toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Compare"
              onClick={() => {
                addCompare(product);
                toast.success("Added to compare");
              }}
            >
              <GitCompareArrows className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
