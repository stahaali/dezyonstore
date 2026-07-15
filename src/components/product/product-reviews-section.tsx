"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type LocalReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

const STORAGE_KEY = "dezyon-product-reviews";

function loadReviews(productId: string): LocalReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, LocalReview[]>;
    return Array.isArray(all[productId]) ? all[productId] : [];
  } catch {
    return [];
  }
}

function saveReviews(productId: string, reviews: LocalReview[]) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const all = (raw ? JSON.parse(raw) : {}) as Record<string, LocalReview[]>;
  all[productId] = reviews;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

function Stars({
  value,
  onChange,
  size = "sm",
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: "sm" | "md";
}) {
  const cls = size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(n)}
            className={cn(
              "p-0",
              onChange ? "cursor-pointer" : "cursor-default",
            )}
            aria-label={`${n} stars`}
          >
            <Star
              className={cn(
                cls,
                "text-amber-400",
                filled ? "fill-amber-400" : "fill-none",
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ProductReviewsSection({ product }: { product: Product }) {
  const [reviews, setReviews] = useState<LocalReview[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    setReviews(loadReviews(product.id));
  }, [product.id]);

  const localAvg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : product.rating;
  const totalCount = product.reviewCount + reviews.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      toast.error("Please enter your name and review.");
      return;
    }
    const next: LocalReview = {
      id: `r-${Date.now()}`,
      author: author.trim(),
      rating,
      title: title.trim() || "Customer review",
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = [next, ...reviews];
    setReviews(updated);
    saveReviews(product.id, updated);
    setAuthor("");
    setTitle("");
    setComment("");
    setRating(5);
    setOpenForm(false);
    toast.success("Thanks! Your review was submitted.");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Customer reviews</h2>
          <p className="mt-2 text-sm text-gray-500">
            Based on {totalCount.toLocaleString()} reviews · Average{" "}
            {localAvg.toFixed(1)} / 5
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpenForm((v) => !v)}
          className="cursor-pointer rounded-full bg-[#0c2340] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a1c33]"
        >
          {openForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {openForm ? (
        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-3 rounded-lg border border-gray-200 bg-[#f7f8fa] p-4"
        >
          <p className="text-sm font-semibold text-gray-900">Your review</p>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Rating
            </label>
            <Stars value={rating} onChange={setRating} size="md" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#0c2340]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#0c2340]"
              placeholder="Summary of your experience"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0c2340]"
              placeholder="Share details about quality, shipping, and whether you'd recommend it…"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[#0c2340] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1c33]"
          >
            Submit Review
          </button>
        </form>
      ) : null}

      {reviews.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Stars value={r.rating} />
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {r.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {r.comment}
              </p>
              <p className="mt-2 text-xs font-medium text-gray-500">
                — {r.author}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-md border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          No reviews yet. Use <span className="font-semibold">Write a Review</span>{" "}
          to leave the first one.
        </div>
      )}
    </div>
  );
}
