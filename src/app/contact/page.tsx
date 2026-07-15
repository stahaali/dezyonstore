import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapPin, Phone, Mail } from "lucide-react";
import { FOOTER_SOCIAL_ICONS } from "@/components/icons/social-icons";
import { SITE_NAME } from "@/lib/constants";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE_NAME} — questions, support, and collaboration.`,
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left — same structure as CZone contact */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Get in Touch{" "}
              <span className="text-gray-900" aria-hidden>
                !
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600 md:text-[15px]">
              We&apos;re here to help you find the right tech. Whether you have a
              question about our products, need expert advice, or want to explore
              collaboration opportunities, our team is ready to assist you.
            </p>

            <ul className="mt-8 space-y-5 text-sm text-gray-800">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-900"
                  strokeWidth={1.75}
                />
                <span className="leading-relaxed">
                  2465 Finch Ave W, North York, ON M9M 2G1, Canada
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-900"
                  strokeWidth={1.75}
                />
                <a
                  href="tel:+12265010914"
                  className="leading-relaxed hover:text-[#00498e]"
                >
                  +1 226-501-0914
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-900"
                  strokeWidth={1.75}
                />
                <a
                  href="mailto:sales@dezyonstudioinc.store"
                  className="leading-relaxed hover:text-[#00498e]"
                >
                  sales@dezyonstudioinc.store
                </a>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {FOOTER_SOCIAL_ICONS.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center text-gray-900 transition-opacity hover:opacity-70"
                >
                  <FontAwesomeIcon icon={icon} className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right — contact form card */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
