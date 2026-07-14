"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCurrencyStore } from "@/store/currency-store";
import { formatPriceDollar } from "@/lib/format-price";
import { siteLogo } from "@/data/site-assets";
import { cn } from "@/lib/utils";

export function CartSidebar() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());
  const currency = useCurrencyStore((s) => s.currency);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-[80] bg-black/45 transition-opacity duration-300",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={cn(
          "fixed right-0 top-0 z-[90] flex h-full w-full max-w-[380px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-[400px]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-medium text-gray-900">Your cart is empty</p>
              <p className="text-sm text-gray-500">Add products to get started.</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 cursor-pointer rounded-full bg-[#0c2340] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a1c33]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 border-b border-gray-100 pb-5 last:border-0">
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white"
                  >
                    <Image
                      src={product.images[0]?.url ?? siteLogo}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-medium leading-snug text-gray-900 hover:text-[#00498e]"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {formatPriceDollar(product.price, currency)}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="cursor-pointer px-2.5 py-1.5 text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[2rem] border-x border-gray-300 px-2 py-1 text-center text-sm font-semibold text-gray-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="cursor-pointer px-2.5 py-1.5 text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => removeItem(product.id)}
                        className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-gray-200 bg-white px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">SubTotal</span>
              <span className="text-base font-bold text-gray-900">
                {formatPriceDollar(subtotal, currency)}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/cart"
                onClick={closeCart}
                className="cursor-pointer rounded-full border border-[#0c2340] bg-white py-2.5 text-center text-sm font-semibold text-[#0c2340] transition-colors hover:bg-gray-50"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="cursor-pointer rounded-full bg-[#0c2340] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0a1c33]"
              >
                Checkout
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
