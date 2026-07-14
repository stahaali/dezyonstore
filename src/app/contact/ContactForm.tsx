"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Website",
  "Product Inquiry",
  "Order Support",
  "Technical Support",
  "Wholesale / Bulk",
  "Other",
] as const;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          category: formData.get("category"),
          subject: formData.get("subject"),
          comments: formData.get("comments"),
        }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        toast.error(data.message || "Could not send message.");
        return;
      }

      toast.success(data.message || "Message sent!");
      form.reset();
    } catch {
      toast.error("Could not send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-[#f3f4f6] p-5 shadow-sm sm:p-7"
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-gray-900">
            Full Name
          </span>
          <input
            name="name"
            type="text"
            required
            placeholder="Enter Full Name"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#0c2340]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-gray-900">
            Email Address
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder="Enter Email Address"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#0c2340]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-gray-900">
            Phone Number
          </span>
          <input
            name="phone"
            type="tel"
            required
            placeholder="Enter Phone Number"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#0c2340]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-gray-900">
            Category
          </span>
          <select
            name="category"
            required
            defaultValue="Website"
            className="h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#0c2340]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-gray-900">
            Subject
          </span>
          <input
            name="subject"
            type="text"
            required
            placeholder="Enter Subject"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#0c2340]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-gray-900">
            Comments
          </span>
          <textarea
            name="comments"
            required
            rows={5}
            placeholder="Enter Comments"
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0c2340]"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full cursor-pointer rounded-full bg-[#0c2340] text-sm font-bold text-white transition hover:bg-[#0a1c33] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
