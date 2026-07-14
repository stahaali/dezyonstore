"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useCartStore } from "@/store/cart-store";
import { useCurrencyStore } from "@/store/currency-store";
import { formatPriceDollar } from "@/lib/format-price";
import { siteLogo } from "@/data/site-assets";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());
  const currency = useCurrencyStore((s) => s.currency);

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.13 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.get("customerName"),
          customerEmail: form.get("customerEmail"),
          customerPhone: form.get("customerPhone"),
          shippingLine1: form.get("shippingLine1"),
          shippingLine2: form.get("shippingLine2") || null,
          shippingCity: form.get("shippingCity"),
          shippingState: form.get("shippingState"),
          shippingPostalCode: form.get("shippingPostalCode"),
          shippingCountry: form.get("shippingCountry") || "Canada",
          notes: form.get("notes") || null,
          currency,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            name: product.name,
            image: product.images[0]?.url ?? null,
            price: product.price,
            quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      clearCart();
      router.push(
        `/checkout/success?order=${encodeURIComponent(data.orderNumber)}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-16 text-center">
        <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-[#00498e]">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1100px] px-4 py-6 md:py-8">
          <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Checkout
          </h1>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mx-auto grid max-w-[1100px] gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-gray-900">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium text-gray-700">Full name</span>
                <input
                  name="customerName"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-gray-700">Email</span>
                <input
                  name="customerEmail"
                  type="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-gray-700">Phone</span>
                <input
                  name="customerPhone"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-gray-900">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium text-gray-700">Address line 1</span>
                <input
                  name="shippingLine1"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium text-gray-700">Address line 2</span>
                <input
                  name="shippingLine2"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-gray-700">City</span>
                <input
                  name="shippingCity"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-gray-700">Province / State</span>
                <input
                  name="shippingState"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-gray-700">Postal code</span>
                <input
                  name="shippingPostalCode"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-gray-700">Country</span>
                <input
                  name="shippingCountry"
                  defaultValue="Canada"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium text-gray-700">Order notes</span>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
                />
              </label>
            </div>
          </section>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <aside className="h-fit rounded-xl border border-gray-200 bg-[#f7f8fa] p-5">
          <h2 className="text-base font-bold text-gray-900">Order summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-auto">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-gray-200 bg-white">
                  <Image
                    src={product.images[0]?.url ?? siteLogo}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">Qty {quantity}</p>
                </div>
                <p className="text-xs font-semibold text-gray-900">
                  {formatPriceDollar(product.price * quantity, currency)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPriceDollar(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? "Free" : formatPriceDollar(shipping, currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (est. 13%)</span>
              <span className="font-medium">{formatPriceDollar(tax, currency)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
              <span>Total</span>
              <span>{formatPriceDollar(total, currency)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full cursor-pointer rounded-full bg-[#0c2340] py-3 text-sm font-semibold text-white hover:bg-[#0a1c33] disabled:opacity-60"
          >
            {loading ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
