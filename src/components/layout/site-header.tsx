"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCurrencyStore } from "@/store/currency-store";
import { products } from "@/data/products";
import { secondaryNav } from "@/data/home";
import { siteLogo } from "@/data/site-assets";
import { filterProductsByQuery } from "@/lib/search-products";
import { useHasMounted } from "@/hooks/use-has-mounted";
import type { CurrencyCode } from "@/lib/format-price";

const HEADER_TOP = "#00498e";
const HEADER_NAV = "#003a72";
const HEADER_YELLOW = "#ffc107";
const CURRENCIES: { code: CurrencyCode; flagSrc: string; label: string }[] = [
  { code: "CAD", flagSrc: "/assets/images/flags/ca.svg", label: "Canada" },
  { code: "USD", flagSrc: "/assets/images/flags/us.svg", label: "United States" },
];

export function SiteHeader() {
  const router = useRouter();
  const mounted = useHasMounted();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const cartCountRaw = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCountRaw = useWishlistStore((s) => s.items.length);
  const currencyRaw = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  const cartCount = mounted ? cartCountRaw : 0;
  const wishlistCount = mounted ? wishlistCountRaw : 0;
  const currency = mounted ? currencyRaw : "CAD";

  const suggestions = useMemo(
    () => filterProductsByQuery(products, searchQuery).slice(0, 6),
    [searchQuery],
  );

  function runSearch(e?: FormEvent) {
    e?.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    if (!q) {
      router.push("/products");
      return;
    }
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (!href.startsWith("/#")) return;
    if (window.location.pathname !== "/") return;
    e.preventDefault();
    setMobileOpen(false);
    const id = href.slice(2);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", href);
  }

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Main header */}
      <div style={{ backgroundColor: HEADER_TOP }} className="text-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 md:py-4">
          <Link href="/" className="shrink-0">
            <Image
              src={siteLogo}
              alt="Dezyon Store"
              width={280}
              height={80}
              className="h-14 w-auto md:h-16"
              priority
            />
          </Link>

          {/* Search */}
          <div className="relative hidden flex-1 md:block">
            <form className="relative" onSubmit={runSearch} role="search">
              <input
                type="search"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="h-11 w-full rounded-full bg-white pl-5 pr-14 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                aria-label="Search products"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:brightness-95"
                style={{ backgroundColor: HEADER_YELLOW }}
                aria-label="Search"
              >
                <Search className="h-4 w-4 text-gray-700" />
              </button>
            </form>
            {searchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className="font-medium">{p.name}</span>
                        <span className="ml-2 text-gray-500">{p.brandName}</span>
                      </Link>
                    ))}
                    <button
                      type="button"
                      className="block w-full border-t border-gray-100 px-4 py-2.5 text-left text-sm font-semibold text-[#00498e] hover:bg-gray-50"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => runSearch()}
                    >
                      See all results for “{searchQuery.trim()}”
                    </button>
                  </>
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No matches. Press Enter to search all products.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-3">
            <Link
              href="/login"
              className="hidden rounded-full p-2.5 transition-colors hover:bg-white/10 sm:flex"
              aria-label="Login"
              title="Login"
            >
              <User className="h-6 w-6 stroke-[1.5]" />
            </Link>
            <Link
              href="/account/wishlist"
              className="relative rounded-full p-2.5 transition-colors hover:bg-white/10"
              aria-label="Wishlist"
            >
              <Heart className="h-6 w-6 stroke-[1.5]" />
              <span
                className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-gray-900"
                style={{ backgroundColor: HEADER_YELLOW }}
              >
                {wishlistCount}
              </span>
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative cursor-pointer rounded-full p-2.5 transition-colors hover:bg-white/10"
              aria-label="Cart"
            >
              <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
              <span
                className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-gray-900"
                style={{ backgroundColor: HEADER_YELLOW }}
              >
                {cartCount}
              </span>
            </button>
            <div className="relative hidden md:block">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-white/10"
                aria-expanded={currencyOpen}
                aria-haspopup="listbox"
                aria-label={`Currency ${currency}`}
                onClick={() => setCurrencyOpen((o) => !o)}
                onBlur={() => setTimeout(() => setCurrencyOpen(false), 150)}
              >
                <img
                  src={
                    CURRENCIES.find((c) => c.code === currency)?.flagSrc ??
                    "/assets/images/flags/ca.svg"
                  }
                  alt=""
                  width={20}
                  height={14}
                  className="h-3.5 w-5 rounded-[2px] object-cover shadow-sm"
                />
                <span>{currency}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </button>
              {currencyOpen ? (
                <ul
                  role="listbox"
                  className="absolute right-0 top-full z-50 mt-1 min-w-[112px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-gray-900 shadow-lg"
                >
                  {CURRENCIES.map(({ code, flagSrc, label }) => (
                    <li key={code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={currency === code}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-gray-50 ${
                          currency === code ? "bg-gray-100 text-[#00498e]" : ""
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setCurrency(code);
                          setCurrencyOpen(false);
                        }}
                      >
                        <img
                          src={flagSrc}
                          alt={label}
                          width={20}
                          height={14}
                          className="h-3.5 w-5 rounded-[2px] object-cover shadow-sm"
                        />
                        <span>{code}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <button
              type="button"
              className="rounded-full p-2.5 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary category nav */}
      <div
        className="hidden lg:block"
        style={{ backgroundColor: HEADER_NAV }}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center gap-0 overflow-x-auto px-4">
          {secondaryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="flex shrink-0 items-center gap-1 px-3.5 py-3.5 text-sm font-medium text-white transition-colors hover:text-[#ffc107]"
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="px-4 py-4 lg:hidden"
          style={{ backgroundColor: HEADER_TOP }}
        >
          <form className="relative mb-4" onSubmit={runSearch} role="search">
            <input
              type="search"
              placeholder="What are you looking for?"
              className="h-11 w-full rounded-full bg-white pl-5 pr-14 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ backgroundColor: HEADER_YELLOW }}
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-gray-700" />
            </button>
          </form>
          <nav className="flex flex-col">
            {secondaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between border-b border-white/10 py-3 text-sm font-medium text-white"
                onClick={(e) => {
                  handleNavClick(e, item.href);
                  setMobileOpen(false);
                }}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-4 w-4 opacity-70" />}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
