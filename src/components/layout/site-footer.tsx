import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapPin, Phone, Mail } from "lucide-react";
import { FOOTER_SOCIAL_ICONS } from "@/components/icons/social-icons";

const productLinks = [
  { label: "Home", href: "/" },
  { label: "Laptops", href: "/categories/laptops" },
  { label: "LCDs", href: "/categories/desktop-pcs" },
  { label: "Servers", href: "/categories/servers" },
  { label: "Gaming Pc", href: "/categories/gaming-pcs" },
  { label: "Gaming Accessories", href: "/categories/gaming-accessories" },
  { label: "Gaming Chair", href: "/categories/gaming-chairs" },
  { label: "Peripherals", href: "/categories/peripherals" },
  { label: "Razer Accessories", href: "/categories/razer-products" },
  { label: "Pricing", href: "/pricing" },
];

const accountLinks = [
  { label: "Sign Up", href: "/account/register" },
  { label: "My Account", href: "/account" },
  { label: "Shopping Cart", href: "/cart" },
];

const corporateLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Return & Exchange", href: "/return-exchange" },
];

const socialLinks = FOOTER_SOCIAL_ICONS;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="bg-[#f1f3f8] py-12 md:py-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.55fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          {/* Company */}
          <div>
            <p className="text-sm leading-[1.7] text-gray-800">
              Welcome to Dezyon Store. Online computer store in Canada. Buy
              Laptops, LCDs, Servers, Gaming PC at the best prices in Canada.
            </p>

            <ul className="mt-6 space-y-3.5 text-sm text-gray-800">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" strokeWidth={1.75} />
                <span className="leading-relaxed">
                  2465 Finch Ave W, North York, ON M9M 2G1, Canada
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" strokeWidth={1.75} />
                <span>+1 226-501-0914</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" strokeWidth={1.75} />
                <span>sales@dezyonstudioinc.store</span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-6 w-6 shrink-0 items-center justify-center text-[#0f172a] transition-opacity hover:opacity-70"
                >
                  <FontAwesomeIcon icon={icon} className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-4 text-[15px] font-bold text-gray-900">Products</h4>
            <ul className="space-y-2.5 text-sm text-gray-800">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-gray-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-4 text-[15px] font-bold text-gray-900">Account</h4>
            <ul className="space-y-2.5 text-sm text-gray-800">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-gray-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="mb-4 text-[15px] font-bold text-gray-900">Corporate</h4>
            <ul className="space-y-2.5 text-sm text-gray-800">
              {corporateLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-gray-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#0c2340] py-4 text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center px-4 text-sm sm:justify-start">
          <p>© {year} Dezyon Store. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
