import Link from "next/link";
import { redirect } from "next/navigation";
import { clearSession, getAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-gray-900">
      <header className="admin-print-hide border-b border-slate-800 bg-[#0c2340] text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-bold tracking-tight">
              Dezyon Admin
            </Link>
            {admin ? (
              <nav className="flex gap-4 text-sm text-white/80">
                <Link href="/admin/orders" className="hover:text-white">
                  Orders
                </Link>
                <Link href="/" className="hover:text-white">
                  View store
                </Link>
              </nav>
            ) : null}
          </div>
          {admin ? (
            <form
              action={async () => {
                "use server";
                await clearSession();
                redirect("/login?panel=admin");
              }}
            >
              <div className="flex items-center gap-3 text-sm">
                <span className="hidden text-white/70 sm:inline">{admin.email}</span>
                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/20"
                >
                  Logout
                </button>
              </div>
            </form>
          ) : (
            <Link
              href="/login?panel=admin"
              className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
            >
              Login
            </Link>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-[1200px] px-4 py-6">{children}</div>
    </div>
  );
}
