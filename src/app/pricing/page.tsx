import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ComboPackagesGrid } from "@/components/pricing/combo-packages-grid";
import { comboPackages } from "@/data/packages";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing & Combo Packages",
  description: `Shop combo packages at ${SITE_NAME} — office, gaming peripherals, chairs, streamer kits, and complete gaming bundles at bundle prices.`,
};

export default function PricingPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:py-8">
          <Breadcrumbs items={[{ label: "Pricing" }]} />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Pricing & Combo Packages
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-[15px]">
            Bundle and save. Pick a ready-made combo for work, play, or
            streaming — curated gear at a better price than buying each piece
            alone.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8 md:py-10">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">
              Combo Packages
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {comboPackages.length} packages · CAD pricing · Add straight to
              cart
            </p>
          </div>
          <Link
            href="/contact"
            className="text-sm font-medium text-[#1e3a5f] underline-offset-2 hover:underline"
          >
            Need a custom quote? Contact us
          </Link>
        </div>

        <ComboPackagesGrid packages={comboPackages} />

        <div className="mt-12 rounded-xl border border-gray-200 bg-[#f7f8fa] px-5 py-6 md:px-8 md:py-8">
          <h3 className="text-base font-bold text-gray-900 md:text-lg">
            How combo pricing works
          </h3>
          <ul className="mt-3 grid gap-2 text-sm text-gray-700 md:grid-cols-3 md:gap-4">
            <li>
              <span className="font-semibold text-gray-900">1. Choose a package</span>
              <p className="mt-1 text-gray-600">
                Each combo lists what&apos;s included and how much you save vs
                buying separately.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">2. Add to cart</span>
              <p className="mt-1 text-gray-600">
                Combos checkout like any other product — same shipping and
                support.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">3. Custom builds</span>
              <p className="mt-1 text-gray-600">
                Want a different PC, chair, or monitor mix?{" "}
                <Link href="/contact" className="font-medium text-[#1e3a5f] underline">
                  Message us
                </Link>{" "}
                for a tailored package.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
