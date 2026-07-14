"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useCartStore } from "@/store/cart-store";
import { useCurrencyStore } from "@/store/currency-store";
import { formatPriceDollar } from "@/lib/format-price";
import { siteLogo } from "@/data/site-assets";
import { useHasMounted } from "@/hooks/use-has-mounted";

export default function CartPage() {
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());
  const currency = useCurrencyStore((s) => s.currency);

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:py-8">
          <Breadcrumbs items={[{ label: "Shopping Cart" }]} />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Shopping Cart
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8">
        {!mounted ? (
          <p className="py-16 text-center text-sm text-gray-500">Loading cart…</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
            <p className="text-base font-semibold text-gray-900">Your cart is empty</p>
            <p className="mt-2 text-sm text-gray-500">
              Browse categories and add products to your cart.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex cursor-pointer rounded-full bg-[#0c2340] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1c33]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white"
                  >
                    <Image
                      src={product.images[0]?.url ?? siteLogo}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-semibold text-gray-900 hover:text-[#00498e]"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {formatPriceDollar(product.price, currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="cursor-pointer px-2.5 py-1.5 hover:bg-gray-50"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] border-x border-gray-300 px-2 py-1 text-center text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="cursor-pointer px-2.5 py-1.5 hover:bg-gray-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${product.name}`}
                      onClick={() => removeItem(product.id)}
                      className="cursor-pointer rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-xl border border-gray-200 bg-[#f7f8fa] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">SubTotal</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPriceDollar(subtotal, currency)}
                </span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 flex cursor-pointer items-center justify-center rounded-full bg-[#0c2340] py-3 text-sm font-semibold text-white hover:bg-[#0a1c33]"
              >
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
