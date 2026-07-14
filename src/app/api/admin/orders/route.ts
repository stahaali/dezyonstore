import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { getAdminSession } from "@/lib/admin-auth";
import { queryRows } from "@/lib/db";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await queryRows<RowDataPacket[]>(
      `SELECT
        id, order_number, customer_name, customer_email, customer_phone,
        shipping_city, shipping_state, shipping_country,
        status, subtotal, shipping, tax, total, currency, created_at
       FROM orders
       ORDER BY created_at DESC
       LIMIT 200`,
    );

    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    console.error("[admin/orders]", error);
    return NextResponse.json(
      { ok: false, error: "Failed to load orders" },
      { status: 500 },
    );
  }
}
