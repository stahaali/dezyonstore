import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, newId, newOrderNumber } from "@/lib/db";

const itemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  image: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  shippingLine1: z.string().min(3),
  shippingLine2: z.string().optional().nullable(),
  shippingCity: z.string().min(2),
  shippingState: z.string().min(2),
  shippingPostalCode: z.string().min(3),
  shippingCountry: z.string().min(2).default("Canada"),
  notes: z.string().optional().nullable(),
  currency: z.string().default("CAD"),
  items: z.array(itemSchema).min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = Math.round(subtotal * 0.13 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const orderId = newId();
    const orderNumber = newOrderNumber();
    const db = getDb();
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      await conn.execute(
        `INSERT INTO orders (
          id, order_number, user_id,
          customer_name, customer_email, customer_phone,
          shipping_line1, shipping_line2, shipping_city, shipping_state,
          shipping_postal_code, shipping_country,
          status, subtotal, shipping, tax, total, currency, notes
        ) VALUES (
          ?, ?, NULL,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          'PENDING', ?, ?, ?, ?, ?, ?
        )`,
        [
          orderId,
          orderNumber,
          data.customerName,
          data.customerEmail,
          data.customerPhone,
          data.shippingLine1,
          data.shippingLine2 || null,
          data.shippingCity,
          data.shippingState,
          data.shippingPostalCode,
          data.shippingCountry,
          subtotal,
          shipping,
          tax,
          total,
          data.currency,
          data.notes || null,
        ],
      );

      for (const item of data.items) {
        await conn.execute(
          `INSERT INTO order_items (
            id, order_id, product_id, product_name, product_image, quantity, price
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            newId(),
            orderId,
            item.productId,
            item.name,
            item.image || null,
            item.quantity,
            item.price,
          ],
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return NextResponse.json({
      ok: true,
      orderId,
      orderNumber,
      total,
      currency: data.currency,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid checkout data", details: error.issues },
        { status: 400 },
      );
    }
    console.error("[checkout]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not save order. Check MySQL connection and that you imported the database schema.",
      },
      { status: 500 },
    );
  }
}
