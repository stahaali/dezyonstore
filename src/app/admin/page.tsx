import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

export default async function AdminIndexPage() {
  const admin = await getAdminSession();
  redirect(admin ? "/admin/orders" : "/login?panel=admin");
}
