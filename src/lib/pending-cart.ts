export type PendingCartAction = {
  productId: string;
  quantity: number;
  buyNow?: boolean;
};

const KEY = "dezyon_pending_cart";

export function setPendingCart(action: PendingCartAction) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(action));
}

export function getPendingCart(): PendingCartAction | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingCartAction;
    if (!parsed?.productId) return null;
    return {
      productId: parsed.productId,
      quantity: Math.max(1, Number(parsed.quantity) || 1),
      buyNow: Boolean(parsed.buyNow),
    };
  } catch {
    return null;
  }
}

export function clearPendingCart() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

/** Only allow same-site relative paths. */
export function safeReturnPath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

export function loginUrlForReturn(returnTo?: string | null) {
  const safe = safeReturnPath(returnTo);
  if (!safe) return "/login";
  return `/login?next=${encodeURIComponent(safe)}`;
}
