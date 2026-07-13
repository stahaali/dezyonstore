"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
          className,
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-bold">{category.name}</h3>
          <p className="text-xs text-white/80">{category.productCount} products</p>
        </div>
      </motion.div>
    </Link>
  );
}
