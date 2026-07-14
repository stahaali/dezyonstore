"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { alertAddedToCart, alertAlreadyInCart } from "@/lib/cart-alerts";
import {
  clearPendingCart,
  getPendingCart,
} from "@/lib/pending-cart";

/**
 * After login, completes any Add to Cart / Buy Now that was interrupted.
 */
export function PendingCartResume() {
  const pathname = usePathname();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return;
    }

    const pending = getPendingCart();
    if (!pending) return;

    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = (await res.json()) as { user?: { id: string } | null };
        if (cancelled || !data.user) return;

        const product = getProductById(pending.productId);
        clearPendingCart();
        if (!product) return;

        const result = addItem(product, pending.quantity);
        if (result === "exists") {
          void alertAlreadyInCart(product.name);
        } else {
          void alertAddedToCart(product.name);
        }

        if (pending.buyNow) {
          router.push("/checkout");
        }
      } catch {
        // keep pending for a later retry
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, addItem, router]);

  return null;
}
