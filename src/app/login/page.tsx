import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const user = await getSession();
  if (user?.role === "ADMIN") redirect("/admin/orders");
  if (user?.role === "CUSTOMER") redirect("/account");

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
