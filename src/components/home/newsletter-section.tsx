"use client";

import { useState } from "react";
import { toast } from "sonner";

const NAVY = "#0b213f";
const YELLOW = "#ffc107";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: NAVY }}>
      <div className="mx-auto max-w-[1400px] px-4 text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Subscribe to our newsletter
        </h2>
        <form
          className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Subscribed successfully!");
            setEmail("");
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email Address..."
            className="h-12 flex-1 rounded-full border-0 bg-white px-6 text-sm text-black outline-none placeholder:text-[#a9a9a9]"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-full px-8 text-sm font-bold text-black transition-colors hover:brightness-95"
            style={{ backgroundColor: YELLOW }}
          >
            Subscribe
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
