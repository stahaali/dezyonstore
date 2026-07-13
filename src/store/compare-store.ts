import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

const MAX_COMPARE = 4;

interface CompareState {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state;
          if (state.items.length >= MAX_COMPARE) return state;
          return { items: [...state.items, product] };
        }),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),
      clear: () => set({ items: [] }),
      has: (productId) => get().items.some((i) => i.id === productId),
    }),
    { name: "dezyon-compare" },
  ),
);
