"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import type { ComboPackage } from "@/data/packages";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

function packageToProduct(pkg: ComboPackage): Product {
  return {
    id: pkg.id,
    name: pkg.title,
    slug: pkg.id,
    shortDescription: pkg.tagline,
    description: pkg.description,
    price: pkg.price,
    compareAtPrice: pkg.compareAtPrice,
    images: [{ id: pkg.id, url: pkg.image, alt: pkg.title }],
    categoryId: "cat-combo",
    categorySlug: "pricing",
    brandId: "br-dezyon",
    brandSlug: "dezyon",
    brandName: "Dezyon",
    rating: 4.8,
    reviewCount: 0,
    inStock: true,
    stock: 99,
    specs: pkg.items.map((item) => ({ label: "Includes", value: item })),
    tags: ["combo", "package"],
    isFeatured: true,
    isGaming: pkg.id.includes("gamer") || pkg.id.includes("gaming") || pkg.id.includes("razer"),
    badge: pkg.popular ? "hot" : "sale",
    createdAt: "2026-07-01",
  };
}

function formatCad(amount: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ComboPackagesGrid({ packages }: { packages: ComboPackage[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  function handleAdd(pkg: ComboPackage) {
    const result = addItem(packageToProduct(pkg));
    setFeedback((prev) => ({
      ...prev,
      [pkg.id]: result === "added" ? "Added to cart" : "Already in cart",
    }));
    window.setTimeout(() => {
      setFeedback((prev) => {
        const next = { ...prev };
        delete next[pkg.id];
        return next;
      });
    }, 2200);
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {packages.map((pkg) => {
        const save = pkg.compareAtPrice - pkg.price;
        const savePct = Math.round((save / pkg.compareAtPrice) * 100);
        return (
          <article
            key={pkg.id}
            className={cn(
              "flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md",
              pkg.popular
                ? "border-[#1e3a5f] ring-1 ring-[#1e3a5f]/40"
                : "border-gray-200",
            )}
          >
            <div className="relative flex flex-1 flex-col px-5 pb-5 pt-5">
              {pkg.popular ? (
                <span className="absolute right-4 top-4 rounded bg-[#1e3a5f] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              ) : (
                <span className="absolute right-4 top-4 rounded bg-emerald-700/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Save {savePct}%
                </span>
              )}
              <p className="pr-24 text-xs font-semibold uppercase tracking-wide text-[#1e3a5f]">
                {pkg.tagline}
              </p>
              <h2 className="mt-1 text-lg font-bold text-gray-900">{pkg.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {pkg.description}
              </p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCad(pkg.price)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatCad(pkg.compareAtPrice)}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-emerald-700">
                You save {formatCad(save)}
              </p>

              <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                {pkg.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1e3a5f]"
                      strokeWidth={2.5}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-2 pt-5">
                <button
                  type="button"
                  onClick={() => handleAdd(pkg)}
                  className="w-full cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#152a45]"
                >
                  {feedback[pkg.id] ?? "Add Combo to Cart"}
                </button>
                {pkg.href ? (
                  <Link
                    href={pkg.href}
                    className="text-center text-sm font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
                  >
                    Browse related products
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
