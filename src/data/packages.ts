export interface ComboPackage {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice: number;
  popular?: boolean;
  items: string[];
  href?: string;
  image: string;
}

/** Storefront combo packages — shown on /pricing */
export const comboPackages: ComboPackage[] = [
  {
    id: "pkg-office-starter",
    title: "Office Starter Combo",
    tagline: "Work from home, done right",
    description:
      "Wireless keyboard & mouse set plus a reliable webcam for calls and everyday productivity.",
    price: 129,
    compareAtPrice: 179,
    items: [
      "Wireless keyboard & mouse combo",
      "Full HD webcam",
      "Free Canada-wide shipping",
      "1-year warranty",
    ],
    href: "/categories/peripherals",
    image: "/assets/images/optimized/products/peripherals/12-a4tech-combo-v2.png",
  },
  {
    id: "pkg-gamer-peripherals",
    title: "Gamer Peripherals Combo",
    tagline: "Keyboard · Mouse · Headset",
    description:
      "A ready-to-play desk kit — RGB mechanical keyboard, gaming mouse, and headset at a bundle price.",
    price: 249,
    compareAtPrice: 329,
    popular: true,
    items: [
      "RGB mechanical gaming keyboard",
      "Optical gaming mouse",
      "Stereo gaming headset",
      "Large desk mouse pad",
      "2-year warranty",
    ],
    href: "/categories/gaming-accessories",
    image: "/assets/images/optimized/products/gaming-accessories/4-combo.png",
  },
  {
    id: "pkg-chair-setup",
    title: "Chair & Comfort Combo",
    tagline: "Sit longer. Play better.",
    description:
      "Ergonomic gaming chair paired with a desk mat and lumbar support essentials for long sessions.",
    price: 449,
    compareAtPrice: 549,
    items: [
      "Ergonomic gaming chair",
      "Large gaming desk mat",
      "Lumbar / neck support set",
      "Free assembly guide",
      "2-year warranty",
    ],
    href: "/categories/gaming-chairs",
    image:
      "/assets/images/optimized/products/gaming-accessories/gacz075-andaseat-luna-gaming-chair-ergonomic-rec.webp",
  },
  {
    id: "pkg-streamer",
    title: "Streamer Setup Combo",
    tagline: "Look & sound broadcast-ready",
    description:
      "USB condenser mic, streaming headset, and full HD webcam — a clean starter kit for creators.",
    price: 379,
    compareAtPrice: 469,
    items: [
      "USB condenser microphone",
      "Broadcast headset",
      "Full HD streaming webcam",
      "Boom arm / desk clip kit",
      "2-year warranty",
    ],
    href: "/categories/peripherals",
    image: "/assets/images/optimized/products/razer/rz-seiren.png",
  },
  {
    id: "pkg-complete-gaming",
    title: "Complete Gaming Bundle",
    tagline: "PC + gear in one package",
    description:
      "Prebuilt gaming PC plus peripherals and a chair option path — our best value full setup package.",
    price: 2199,
    compareAtPrice: 2599,
    items: [
      "Prebuilt RTX gaming desktop",
      "Gamer peripherals kit (KB + mouse + headset)",
      "24–27″ gaming monitor option credit",
      "Priority build QA check",
      "3-year system warranty",
    ],
    href: "/categories/gaming-pcs",
    image: "/assets/images/optimized/products/gaming-pcs/alienware-aurora.png",
  },
  {
    id: "pkg-razer-immersive",
    title: "Razer Immersive Combo",
    tagline: "For Gamers. By Gamers.",
    description:
      "Razer mouse + headset essentials bundle — Chroma-ready gear inspired by the Razer Canada lineup.",
    price: 299,
    compareAtPrice: 389,
    items: [
      "Razer gaming mouse",
      "Razer headset",
      "Chroma lighting sync ready",
      "Priority Razer accessories support",
      "2-year warranty",
    ],
    href: "/categories/razer-products",
    image: "/assets/images/optimized/products/razer/rz-deathadder.png",
  },
];

/** @deprecated use comboPackages — kept for any legacy imports */
export type Package = {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
};

export const packages: Package[] = comboPackages.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  price: `$${p.price.toLocaleString("en-CA")}`,
  features: p.items,
}));
