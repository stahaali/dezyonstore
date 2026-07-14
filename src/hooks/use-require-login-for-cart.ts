"use client";

import { useRouter } from "next/navigation";
import { useAuthUser } from "@/hooks/use-auth-user";
import {
  loginUrlForReturn,
  setPendingCart,
} from "@/lib/pending-cart";

type GuardArgs = {
  productId: string;
  quantity?: number;
  buyNow?: boolean;
};

/**
 * Returns true if the user may continue with cart actions.
 * If not logged in, stores a pending cart action and sends them to login.
 */
export function useRequireLoginForCart() {
  const router = useRouter();
  const { user, loading, refresh } = useAuthUser();

  async function ensureLoggedIn(args: GuardArgs): Promise<boolean> {
    const current = loading ? await refresh() : user;
    if (current) return true;

    setPendingCart({
      productId: args.productId,
      quantity: args.quantity ?? 1,
      buyNow: args.buyNow,
    });

    const returnTo =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "/";
    router.push(loginUrlForReturn(returnTo));
    return false;
  }

  return { ensureLoggedIn, user, loading };
}
