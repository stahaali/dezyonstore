import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import Section from "@/components/Section/Section";
import PriceColumn, { PriceColumns } from "@/components/PriceColumn/PriceColumn";
import { packages } from "@/data/packages";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing — Combo, Gaming Accessories, and Accessories plans.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        label="Pricing"
        title="Our Pricing"
        description="Choose the plan that fits your setup — Combo, Gaming Accessories, or Accessories."
      />

      <Section
        label="Plans"
        title="Simple Pricing"
        description="Three clear options. No hidden fees."
        centered
      >
        <PriceColumns>
          {packages.map((pkg, index) => (
            <PriceColumn key={pkg.id} pkg={pkg} featured={index === 1} />
          ))}
        </PriceColumns>
      </Section>
    </>
  );
}
