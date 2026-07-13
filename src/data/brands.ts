import type { Brand } from "@/types";

export const brands: Brand[] = [
  { id: "br-asus", name: "Asus", slug: "asus", logo: "https://images.unsplash.com/photo-1618384887929-16b4ad277747?w=200&q=80", productCount: 42 },
  { id: "br-msi", name: "MSI", slug: "msi", logo: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&q=80", productCount: 38 },
  { id: "br-dell", name: "Dell", slug: "dell", logo: "https://images.unsplash.com/photo-1496181133206-283cecfee452?w=200&q=80", productCount: 35 },
  { id: "br-hp", name: "HP", slug: "hp", logo: "https://images.unsplash.com/photo-1525547719578-a3692a1133f5?w=200&q=80", productCount: 30 },
  { id: "br-lenovo", name: "Lenovo", slug: "lenovo", logo: "https://images.unsplash.com/photo-1588871517520-2597a9358730?w=200&q=80", productCount: 28 },
  { id: "br-acer", name: "Acer", slug: "acer", logo: "https://images.unsplash.com/photo-1603302576837-37561b547e91?w=200&q=80", productCount: 24 },
  { id: "br-nvidia", name: "NVIDIA", slug: "nvidia", logo: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&q=80", productCount: 18 },
  { id: "br-amd", name: "AMD", slug: "amd", logo: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=200&q=80", productCount: 22 },
];

export const laptopBrands = brands.filter((b) =>
  ["dell", "hp", "lenovo", "asus", "acer", "msi"].includes(b.slug),
);
