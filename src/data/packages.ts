export interface Package {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}

export const packages: Package[] = [
  {
    id: "combo",
    title: "Combo",
    description: "Essential combo gear to get started with your setup.",
    price: "$299",
    features: [
      "Keyboard & Mouse",
      "Headset",
      "Mouse Pad",
      "1-Year Warranty",
    ],
  },
  {
    id: "gaming-accessories",
    title: "Gaming Accessories",
    description: "A complete collection for serious gamers and creators.",
    price: "$899",
    features: [
      "Mechanical Keyboard",
      "Wireless Headset",
      "Gaming Chair",
      "RGB Lighting Kit",
      "2-Year Warranty",
    ],
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Premium accessories for uncompromising performance.",
    price: "$1,999",
    features: [
      "Full Peripherals Set",
      "4K Monitor",
      "Ergonomic Chair",
      "Complete RGB Room Setup",
      "Priority Support",
      "3-Year Warranty",
    ],
  },
];
