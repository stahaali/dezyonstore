import { categoryImages } from "@/data/site-assets";

export const quickCategories = [
  {
    id: "processors",
    name: "Processors",
    slug: "processors",
    image: categoryImages.processors,
  },
  {
    id: "tablets",
    name: "Tablets & iPads",
    slug: "accessories",
    image: categoryImages.tablets,
  },
  {
    id: "cameras",
    name: "Cameras | Drones",
    slug: "accessories",
    image: categoryImages.cameras,
  },
  {
    id: "headsets",
    name: "Headsets & Microphones",
    slug: "accessories",
    image: categoryImages.headsets,
  },
  {
    id: "furniture",
    name: "Gaming Furniture",
    slug: "gaming",
    image: categoryImages["gaming-furniture"],
  },
  {
    id: "consoles",
    name: "Gaming Consoles",
    slug: "gaming",
    image: categoryImages.consoles,
  },
  {
    id: "wearables",
    name: "Smart Wearables",
    slug: "accessories",
    image: categoryImages.wearables,
  },
  {
    id: "keyboards",
    name: "Keyboard",
    slug: "keyboards",
    image: categoryImages.keyboards,
  },
  {
    id: "laptops",
    name: "Laptops",
    slug: "laptops",
    image: categoryImages.laptops,
  },
  {
    id: "gpu",
    name: "Graphic Cards",
    slug: "graphic-cards",
    image: categoryImages.cooling,
  },
  {
    id: "gaming-accessories",
    name: "Gaming Accessories",
    slug: "gaming-accessories",
    image: categoryImages.keyboards,
  },
  {
    id: "mouse",
    name: "Mouse",
    slug: "mouse",
    image: categoryImages.keyboards,
  },
  {
    id: "casing",
    name: "Casing",
    slug: "desktop-pcs",
    image: categoryImages.cooling,
  },
  {
    id: "cooling",
    name: "Cooling Solutions",
    slug: "accessories",
    image: categoryImages.cooling,
  },
  {
    id: "ram",
    name: "RAM",
    slug: "ram",
    image: categoryImages.processors,
  },
  {
    id: "ssd",
    name: "SSD",
    slug: "ssd",
    image: categoryImages.cooling,
  },
];

export const secondaryNav = [
  { label: "Home", href: "/#homebanner", hasDropdown: false },
  { label: "Laptops", href: "/categories/laptops", hasDropdown: false },
  { label: "LCDs", href: "/categories/desktop-pcs", hasDropdown: false },
  { label: "Servers", href: "/categories/servers", hasDropdown: false },
  { label: "Gaming Pc", href: "/categories/gaming-pcs", hasDropdown: false },
  { label: "Gaming Accessories", href: "/categories/gaming-accessories", hasDropdown: false },
  { label: "Peripherals", href: "/categories/peripherals", hasDropdown: false },
  { label: "Razer Accessories", href: "/categories/razer-products", hasDropdown: false },
];
