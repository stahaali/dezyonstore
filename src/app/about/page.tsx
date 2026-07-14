import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_NAME} — online computer store in Canada for laptops, LCDs, servers, gaming PCs and more.`,
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1100px] px-4 py-6 md:py-8">
          <Breadcrumbs items={[{ label: "About" }]} />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            About {SITE_NAME}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-10 md:py-12">
        <div className="max-w-3xl space-y-5 text-[15px] leading-relaxed text-gray-700">
          <p>
            Welcome to <strong className="text-gray-900">{SITE_NAME}</strong>. We
            are an online computer store in Canada, offering genuine laptops,
            LCDs, servers, gaming PCs, peripherals, and accessories from trusted
            brands at competitive prices.
          </p>
          <p>
            Our goal is simple: make it easy for students, gamers, creators, and
            businesses to find reliable tech without confusion. Every product we
            list is curated for real-world performance, with clear specs, fair
            pricing, and support you can count on.
          </p>
          <p>
            From everyday notebooks and All-in-One LCDs to high-performance
            gaming desktops and networking gear, {SITE_NAME} is built to help
            you shop with confidence — whether you are upgrading a home setup or
            equipping a workspace.
          </p>
          <p>
            We value transparency, authentic products, and responsive customer
            care. If you need help choosing the right configuration or tracking
            an order, our team is ready to assist.
          </p>
        </div>
      </div>
    </div>
  );
}
