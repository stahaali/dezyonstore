"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Registration failed");
      }
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[520px] px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Customer accounts are stored in MySQL with role CUSTOMER.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[520px] px-4 py-8">
        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-gray-700">Full name</span>
            <input
              name="name"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-gray-700">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-gray-700">Password</span>
            <input
              name="password"
              type="password"
              minLength={6}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
            />
          </label>
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-md bg-[#0c2340] py-2.5 text-sm font-semibold text-white hover:bg-[#0a1c33] disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#00498e] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
