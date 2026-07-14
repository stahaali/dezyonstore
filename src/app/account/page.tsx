import Link from "next/link";
import { redirect } from "next/navigation";
import { clearSession, getSession } from "@/lib/auth";

export default async function AccountPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin/orders");

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[800px] px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">My account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Signed in as a customer (database user).
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[800px] space-y-4 px-4 py-8">
        <div className="rounded-xl border border-gray-200 p-5">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="mt-0.5 font-semibold text-gray-900">
                {user.name || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="mt-0.5 font-semibold text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Role</dt>
              <dd className="mt-0.5 font-semibold text-gray-900">{user.role}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#0c2340] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1c33]"
          >
            Continue shopping
          </Link>
          <form
            action={async () => {
              "use server";
              await clearSession();
              redirect("/login");
            }}
          >
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
