import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "cat-laptops", name: "Laptops", slug: "laptops", description: "Portable power for work and play", image: "https://images.unsplash.com/photo-1496181133206-283cecfee452?w=600&q=80", productCount: 48 },
  { id: "cat-desktops", name: "Desktop PCs", slug: "desktop-pcs", description: "Custom and pre-built desktops", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80", productCount: 32 },
  { id: "cat-servers", name: "Servers", slug: "servers", description: "Tower and rack servers for business", image: "/assets/images/optimized/products/servers/dell-tower.png", productCount: 12 },
  { id: "cat-gpu", name: "Graphic Cards", slug: "graphic-cards", description: "High-performance GPUs", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80", productCount: 24 },
  { id: "cat-cpu", name: "Processors", slug: "processors", description: "Latest gen CPUs", image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80", productCount: 18 },
  { id: "cat-motherboards", name: "Motherboards", slug: "motherboards", description: "ATX, mATX & ITX boards", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", productCount: 22 },
  { id: "cat-ram", name: "RAM", slug: "ram", description: "DDR4 & DDR5 memory", image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80", productCount: 30 },
  { id: "cat-ssd", name: "SSD", slug: "ssd", description: "NVMe & SATA solid state", image: "https://images.unsplash.com/photo-1531492746076-1614caab2b77?w=600&q=80", productCount: 26 },
  { id: "cat-hdd", name: "Hard Drives", slug: "hard-drives", description: "High-capacity storage", image: "https://images.unsplash.com/photo-1597872200969-2b65d8bd3907?w=600&q=80", productCount: 14 },
  { id: "cat-gaming", name: "Gaming", slug: "gaming", description: "Complete gaming ecosystem", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80", productCount: 56 },
  { id: "cat-monitors", name: "Monitors", slug: "monitors", description: "4K, ultrawide & gaming displays", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80", productCount: 36 },
  { id: "cat-keyboards", name: "Keyboards", slug: "keyboards", description: "Mechanical & wireless", image: "https://images.unsplash.com/photo-1511467592992-7a57e69e550b?w=600&q=80", productCount: 40 },
  { id: "cat-mouse", name: "Mouse", slug: "mouse", description: "Precision gaming mice", image: "https://images.unsplash.com/photo-1527864554075-7fd91ec51a46?w=600&q=80", productCount: 28 },
  { id: "cat-networking", name: "Networking", slug: "networking", description: "Routers, switches & adapters", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", productCount: 20 },
  { id: "cat-printers", name: "Printers", slug: "printers", description: "Home & office printers", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80", productCount: 12 },
  { id: "cat-accessories", name: "Accessories", slug: "accessories", description: "Cables, stands & more", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", productCount: 64 },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
