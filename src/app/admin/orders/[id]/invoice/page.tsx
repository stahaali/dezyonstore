import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { getAdminSession } from "@/lib/auth";
import { queryRows } from "@/lib/db";
import { SITE_NAME } from "@/lib/constants";
import { InvoicePrintButton } from "./invoice-print-button";

export const dynamic = "force-dynamic";

type OrderRow = RowDataPacket & {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_line1: string;
  shipping_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  status: string;
  subtotal: string | number;
  shipping: string | number;
  tax: string | number;
  total: string | number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ItemRow = RowDataPacket & {
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: string | number;
};

function money(value: string | number, currency: string) {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency || "CAD",
  }).format(Number.isFinite(n) ? n : 0);
}

function statusClass(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-800";
    case "SHIPPED":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-green-100 text-green-900";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-900";
  }
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminSession();
  if (!admin) redirect("/login?panel=admin");

  const { id } = await params;

  let order: OrderRow | undefined;
  let items: ItemRow[] = [];

  try {
    const orders = await queryRows<OrderRow[]>(
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [id],
    );
    order = orders[0];
    if (order) {
      items = await queryRows<ItemRow[]>(
        `SELECT product_name, product_image, quantity, price
         FROM order_items WHERE order_id = ?`,
        [id],
      );
    }
  } catch (error) {
    console.error("[invoice]", error);
    notFound();
  }

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-[800px]">
      <style>{`
        @media print {
          body { background: white !important; }
          .admin-print-hide { display: none !important; }
          .invoice-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 admin-print-hide">
        <Link href="/admin/orders" className="text-sm font-medium text-[#00498e] hover:underline">
          ← Back to orders
        </Link>
        <InvoicePrintButton />
      </div>

      <article className="invoice-sheet rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <p className="text-2xl font-bold text-[#0c2340]">{SITE_NAME}</p>
            <p className="mt-1 text-sm text-gray-500">Invoice</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold text-gray-900">{order.order_number}</p>
            <p className="text-gray-600">
              Ordered: {new Date(order.created_at).toLocaleString()}
            </p>
            <p className="mt-2 inline-block rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide">
              <span className={`rounded px-2 py-1 ${statusClass(order.status)}`}>
                Status: {order.status}
              </span>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Last updated: {new Date(order.updated_at || order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Bill to
            </h2>
            <p className="mt-2 font-semibold text-gray-900">{order.customer_name}</p>
            <p className="text-sm text-gray-600">{order.customer_email}</p>
            <p className="text-sm text-gray-600">{order.customer_phone}</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Ship to
            </h2>
            <p className="mt-2 text-sm text-gray-800">
              {order.shipping_line1}
              {order.shipping_line2 ? (
                <>
                  <br />
                  {order.shipping_line2}
                </>
              ) : null}
              <br />
              {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
              <br />
              {order.shipping_country}
            </p>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <th className="pb-2 font-semibold">Item</th>
              <th className="pb-2 font-semibold">Qty</th>
              <th className="pb-2 font-semibold">Price</th>
              <th className="pb-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const price = Number(item.price);
              const amount = price * item.quantity;
              return (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{item.product_name}</td>
                  <td className="py-3">{item.quantity}</td>
                  <td className="py-3">{money(price, order.currency)}</td>
                  <td className="py-3 text-right font-semibold">
                    {money(amount, order.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{money(order.subtotal, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{money(order.shipping, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>{money(order.tax, order.currency)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
            <span>Total</span>
            <span>{money(order.total, order.currency)}</span>
          </div>
        </div>

        {order.notes ? (
          <p className="mt-8 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Notes: </span>
            {order.notes}
          </p>
        ) : null}

        <p className="mt-10 text-center text-xs text-gray-400">
          Generated by {SITE_NAME} admin · Status from database: {order.status}
        </p>
      </article>
    </div>
  );
}
