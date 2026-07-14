import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Return & Exchange",
  description: `Warranty, returns, exchanges, and order policy for ${SITE_NAME}.`,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 border-b border-gray-200 pb-2 text-xl font-bold tracking-tight text-gray-900 first:mt-0 md:text-2xl">
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 text-base font-bold text-gray-900 md:text-lg">
      {children}
    </h3>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-gray-700">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

export default function ReturnExchangePage() {
  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1100px] px-4 py-6 md:py-8">
          <Breadcrumbs items={[{ label: "Return & Exchange" }]} />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Warranty, Returns, Exchanges, and Order Policy
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-10 md:py-12">
        <div className="max-w-3xl">
          <SectionTitle>Warranty Policy</SectionTitle>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            At {SITE_NAME}, we offer warranty services based on manufacturer,
            supplier, or distributor terms. Please read the following conditions
            carefully before making a claim.
          </p>

          <SubTitle>General Warranty Terms</SubTitle>
          <List
            items={[
              "Warranty covers manufacturing defects within the specified period.",
              "Warranty is provided by the manufacturer, supplier, or distributor. We act solely as a reseller/vendor, and warranty service is provided according to the manufacturer, supplier, or distributor terms.",
              'If your invoice mentions "Warranty Card Issued," ensure you receive it along with your invoice. Without it, our customer support cannot process your claim.',
              "The original invoice is required for all warranty claims. Claims without a valid invoice may be declined.",
            ]}
          />

          <SubTitle>Important Conditions</SubTitle>
          <List
            items={[
              "Check your product carefully when it arrives. The warranty starts once the invoice is generated. Any issues afterward will be processed as a normal warranty claim.",
              "The manufacturer may reject claims if the product/component is broken, burned, or rusted due to environmental conditions.",
              "Claims may be rejected if the product is submitted in poor condition or not packed in its original protective material.",
              "Claims may be rejected if the warranty sticker or serial number is damaged or tampered with.",
              "Accidental damage, electrical surges, and software-related issues are not covered.",
              "Power adapters, cables, printer cartridges/toners, and additional accessories are not covered under warranty.",
            ]}
          />

          <SubTitle>Warranty Claim Process</SubTitle>
          <List
            items={[
              "If the claim is approved, the manufacturer/supplier/distributor will repair or replace the product at their discretion.",
              "Processing time for warranty claims may take 3 to 6 weeks.",
              "If the product is discontinued, the manufacturer may offer an upgrade for an additional charge. If the customer refuses, a partial refund may be issued.",
              "Some products come with Limited Warranty, meaning the first year is free, and additional years require a paid service.",
            ]}
          />

          <SubTitle>Special Cases</SubTitle>
          <List
            items={[
              "International Warranty: Customers must register the product with the manufacturer and handle the claim directly.",
              "Used or open-box hardware comes with a checking warranty only. Customers must inspect the product before purchase.",
              "PC Warranty: Warranty is void if the PC case is opened or components are added/removed without prior approval from our service team.",
              "LCDs/LEDs: Warranty does not cover screen defects like dead pixels or dots, unless covered under the manufacturer’s pixel policy.",
            ]}
          />

          <SubTitle>Warranty Service Hours</SubTitle>
          <List
            items={[
              "We accept warranty claims Monday to Friday during store hours (see Contact page for timings).",
              "For further assistance, please contact our support team at +1 226-501-0914 or hello@dezyonstore.inc.",
            ]}
          />

          <SectionTitle>Return Policy</SectionTitle>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            At {SITE_NAME}, we strive to provide high-quality computer parts and
            accessories. Please review our return policy before making a
            purchase.
          </p>

          <SubTitle>Eligibility for Returns</SubTitle>
          <List
            items={[
              "We accept returns under the following conditions:",
              "The item must be returned within 7 days of the purchase date.",
              "The product must be strictly sealed, unopened, and in its original packaging.",
              "Opened, used, or damaged products cannot be returned.",
            ]}
          />

          <SubTitle>Non-Returnable Items</SubTitle>
          <List
            items={[
              "Opened or unsealed products. Once the packaging is broken, the item is considered sold.",
              "Backordered items requested on order. These items are final sale and cannot be returned or exchanged.",
              "Software, licenses, and digital downloads.",
              "Products damaged during shipping must be reported within 24 hours of delivery, along with a clear unboxing or package opening video showing the condition of the package and the product.",
            ]}
          />

          <SubTitle>Return Process</SubTitle>
          <List
            items={[
              "Contact our support team at hello@dezyonstore.inc within 7 days of purchase.",
              "Provide your order number and proof of purchase.",
              "If the return is approved, you will receive instructions on how to ship the item back.",
              "The customer is responsible for the return shipping cost, unless the item received was incorrect or defective on arrival.",
            ]}
          />

          <SubTitle>Refunds</SubTitle>
          <List
            items={[
              "Once we receive and inspect the item, we will process a refund using your original payment method.",
              "Refunds will be issued only if the item meets our return conditions.",
              "Shipping fees are non-refundable, except where the return is due to our error.",
            ]}
          />

          <SectionTitle>Order Cancellation Policy</SectionTitle>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            We reserve the right to cancel, refuse, or limit any order placed
            through our website, online platforms, or other sales channels at
            our sole discretion. Orders may be cancelled at any stage of the
            processing cycle, including after confirmation, without prior notice
            where reasonably necessary.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            Orders may be cancelled in circumstances including, but not limited
            to, the following:
          </p>
          <List
            items={[
              "Product Unavailability: If the ordered product becomes unavailable due to stock limitations, supply issues, or inventory discrepancies.",
              "Incomplete or Incorrect Information: If the shipping address, contact details, or other order information provided by the customer is incomplete, inaccurate, or cannot be reasonably verified for delivery purposes.",
              "Suspicious or High-Risk Orders: If the order is flagged by our internal verification system as suspicious, potentially fraudulent, or high risk.",
              "Operational or Pricing Errors: If an order contains incorrect pricing, technical errors, or system malfunctions affecting the order details.",
            ]}
          />
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            In the event of order cancellation prior to payment or shipment, the
            customer shall not be entitled to any compensation or damages. If
            payment has already been received for an order that is subsequently
            cancelled, the customer will be eligible for a refund in accordance
            with our Refund Policy.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            By placing an order with our company, the customer acknowledges and
            agrees to these terms and conditions.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            <strong className="text-gray-900">Governing Law:</strong> These
            Terms and Conditions are governed by the laws of the Province of
            Ontario and the applicable laws of Canada. By placing an order or
            using our services, you agree that the courts of Ontario shall have
            jurisdiction over any dispute arising in connection with our
            products or services.
          </p>

          <div className="mt-10 rounded-xl border border-gray-200 bg-[#f7f8fa] px-5 py-5">
            <p className="text-sm font-semibold text-gray-900">
              Need help with a return or warranty claim?
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Call{" "}
              <a
                href="tel:+12265010914"
                className="font-medium text-[#00498e] hover:underline"
              >
                +1 226-501-0914
              </a>
              , email{" "}
              <a
                href="mailto:hello@dezyonstore.inc"
                className="font-medium text-[#00498e] hover:underline"
              >
                hello@dezyonstore.inc
              </a>
              , or visit our{" "}
              <Link
                href="/contact"
                className="font-medium text-[#00498e] hover:underline"
              >
                Contact
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
