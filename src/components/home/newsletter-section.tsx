"use client";

import { useState } from "react";
import { toast } from "sonner";

const NAVY = "#0b213f";
const YELLOW = "#ffc107";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        alreadySubscribed?: boolean;
        previewUrl?: string | null;
      };

      if (!res.ok || !data.ok) {
        toast.error(data.message || "Could not subscribe. Please try again.");
        return;
      }

      if (data.alreadySubscribed) {
        toast.message(data.message || "You are already subscribed.");
      } else {
        toast.success(data.message || "Subscribed successfully!");
        if (data.previewUrl && process.env.NODE_ENV === "development") {
          console.info("Newsletter welcome email preview:", data.previewUrl);
        }
      }
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: NAVY }}>
      <div className="mx-auto max-w-[1400px] px-4 text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Subscribe to our newsletter
        </h2>
        <form
          className="mx-auto mt-6 flex max-w-xl flex-col gap-3 max-[576px]:gap-3.5 sm:flex-row sm:items-stretch sm:justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email Address..."
            disabled={loading}
            className="h-12 w-full flex-1 rounded-full border-0 bg-white px-6 text-sm leading-normal text-black outline-none placeholder:text-[#a9a9a9] disabled:opacity-70 max-[576px]:h-14 max-[576px]:min-h-14 max-[576px]:px-5 max-[576px]:text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full shrink-0 cursor-pointer rounded-full px-8 text-sm font-bold text-black transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70 max-[576px]:h-14 max-[576px]:min-h-14 max-[576px]:text-base sm:w-auto"
            style={{ backgroundColor: YELLOW }}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-[#d1d5db]">
          Your personal data will be used to support your experience throughout
          this website, to manage access to your account, and for other purposes
          described in our privacy policy.
        </p>
      </div>
    </section>
  );
}
