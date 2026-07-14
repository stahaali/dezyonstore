"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Panel = "user" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPanel: Panel =
    searchParams.get("panel") === "admin" ? "admin" : "user";

  const [panel, setPanel] = useState<Panel>(initialPanel);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const titles = useMemo(
    () =>
      panel === "admin"
        ? {
            heading: "Admin login",
            sub: "Staff access to orders, invoices, and store management.",
            cta: "Sign in to Admin",
          }
        : {
            heading: "Customer login",
            sub: "Sign in to your Dezyon account to track orders and manage your profile.",
            cta: "Sign in",
          },
    [panel],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          panel,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Login failed");
      }
      router.push(data.redirectTo || (panel === "admin" ? "/admin/orders" : "/account"));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[520px] px-4 py-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Login
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose User or Admin — each signs in against the MySQL{" "}
            <code className="text-xs">users</code> table.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[520px] px-4 py-8">
        <div className="mb-5 grid grid-cols-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => {
              setPanel("user");
              setError(null);
            }}
            className={`cursor-pointer rounded-md py-2.5 text-sm font-semibold transition ${
              panel === "user"
                ? "bg-white text-[#0c2340] shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => {
              setPanel("admin");
              setError(null);
            }}
            className={`cursor-pointer rounded-md py-2.5 text-sm font-semibold transition ${
              panel === "admin"
                ? "bg-white text-[#0c2340] shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Admin
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{titles.heading}</h2>
          <p className="mt-1 text-sm text-gray-500">{titles.sub}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-gray-700">Email</span>
              <input
                name="email"
                type="email"
                required
                defaultValue={
                  panel === "admin" ? "admin@dezyon.store" : "user@dezyon.store"
                }
                key={panel}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00498e]"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-gray-700">Password</span>
              <input
                name="password"
                type="password"
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
              {loading ? "Signing in…" : titles.cta}
            </button>
          </form>

          {panel === "user" ? (
            <p className="mt-4 text-center text-sm text-gray-600">
              New customer?{" "}
              <Link href="/register" className="font-semibold text-[#00498e] hover:underline">
                Create an account
              </Link>
            </p>
          ) : (
            <p className="mt-4 text-center text-xs text-gray-500">
              Demo admin: admin@dezyon.store / admin123 (from DB seed)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
