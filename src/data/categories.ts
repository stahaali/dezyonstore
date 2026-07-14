import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "cat-laptops", name: "Laptops", slug: "laptops", description: "Portable power for work and play", image: "/assets/images/optimized/products/laptops/1-fit.png", productCount: 11 },
  { id: "cat-desktops", name: "LCDs", slug: "desktop-pcs", description: "LCD / LED monitors and All-in-One displays", image: "/assets/images/optimized/products/desktops/1-fit.png", productCount: 18 },
  { id: "cat-servers", name: "Servers", slug: "servers", description: "Tower, rack, and NAS servers for home & business", image: "/assets/images/optimized/products/servers/9-fit.png", productCount: 10 },
  { id: "cat-gaming-pcs", name: "Gaming PCs", slug: "gaming-pcs", description: "Prebuilt RTX gaming desktops ready to play", image: "/assets/images/optimized/products/gaming-pcs/alienware-aurora.png", productCount: 10 },
  { id: "cat-gpu", name: "Graphic Cards", slug: "graphic-cards", description: "High-performance GPUs", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80", productCount: 24 },
  { id: "cat-cpu", name: "Processors", slug: "processors", description: "Latest gen CPUs", image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80", productCount: 18 },
  { id: "cat-motherboards", name: "Motherboards", slug: "motherboards", description: "ATX, mATX & ITX boards", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", productCount: 22 },
  { id: "cat-ram", name: "RAM", slug: "ram", description: "DDR4 & DDR5 memory", image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80", productCount: 30 },
  { id: "cat-ssd", name: "SSD", slug: "ssd", description: "NVMe & SATA solid state", image: "https://images.unsplash.com/photo-1531492746076-1614caab2b77?w=600&q=80", productCount: 26 },
  { id: "cat-hdd", name: "Hard Drives", slug: "hard-drives", description: "High-capacity storage", image: "https://images.unsplash.com/photo-1597872200969-2b65d8bd3907?w=600&q=80", productCount: 14 },
  { id: "cat-gaming", name: "Gaming", slug: "gaming", description: "Complete gaming ecosystem", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80", productCount: 56 },
  { id: "cat-gaming-accessories", name: "Gaming Accessories", slug: "gaming-accessories", description: "Gaming keyboards, mice, headsets & more — inspired by CZone", image: "/assets/images/optimized/products/gaming-accessories/1-g502.png", productCount: 81 },
  { id: "cat-peripherals", name: "Peripherals", slug: "peripherals", description: "Keyboards, mice, headsets and more for work & gaming", image: "/assets/images/optimized/products/peripherals/1-mx-keys.png", productCount: 428 },
  { id: "cat-razer", name: "Razer Accessories", slug: "razer-products", description: "Razer mice, keyboards, headsets, laptops & more — For Gamers. By Gamers. Inspired by Razer Canada", image: "/assets/images/optimized/products/razer/rz-deathadder.png", productCount: 15 },
  { id: "cat-keyboards", name: "Keyboards", slug: "keyboards", description: "Mechanical & wireless", image: "https://images.unsplash.com/photo-1511467592992-7a57e69e550b?w=600&q=80", productCount: 40 },
  { id: "cat-mouse", name: "Mouse", slug: "mouse", description: "Precision gaming mice", image: "https://images.unsplash.com/photo-1527864554075-7fd91ec51a46?w=600&q=80", productCount: 28 },
  { id: "cat-networking", name: "Networking", slug: "networking", description: "Routers, switches & adapters", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", productCount: 20 },
  { id: "cat-printers", name: "Printers", slug: "printers", description: "Home & office printers", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80", productCount: 12 },
  { id: "cat-accessories", name: "Accessories", slug: "accessories", description: "Cables, stands & more", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", productCount: 64 },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
