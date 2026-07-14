import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { safeReturnPath } from "@/lib/pending-cart";
import LoginForm from "./login-form";

type PageProps = {
  searchParams: Promise<{ next?: string; panel?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = safeReturnPath(params.next ?? null);
  const user = await getSession();

  if (user?.role === "ADMIN") redirect("/admin/orders");
  if (user?.role === "CUSTOMER") redirect(next || "/account");

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[520px] px-4 py-16 text-center text-sm text-gray-500">
          Loading login…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
