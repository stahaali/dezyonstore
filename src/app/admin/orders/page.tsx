import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminOrdersPage from "./orders-table";

export default async function AdminOrdersRoute() {
  const email = await getAdminSession();
  if (!email) redirect("/login?panel=admin");
  return <AdminOrdersPage />;
}
