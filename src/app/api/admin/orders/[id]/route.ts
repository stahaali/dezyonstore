import { NextResponse } from "next/server";
import { z } from "zod";
import type { ResultSetHeader } from "mysql2";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

const patchSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = patchSchema.parse(await request.json());

    const [result] = await getDb().query<ResultSetHeader>(
      `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`,
      [body.status, id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      id,
      status: body.status,
      message: "Status saved to database",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
    }
    console.error("[admin/orders/patch]", error);
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
}
