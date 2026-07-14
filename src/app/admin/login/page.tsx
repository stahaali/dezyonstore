import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLoginRedirect() {
  const user = await getSession();
  if (user?.role === "ADMIN") redirect("/admin/orders");
  redirect("/login?panel=admin");
}
