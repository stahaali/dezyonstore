import { NextResponse } from "next/server";
import { z } from "zod";
import { newId, queryExec } from "@/lib/db";

const CATEGORIES = [
  "Website",
  "Product Inquiry",
  "Order Support",
  "Technical Support",
  "Wholesale / Bulk",
  "Other",
] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(50),
  category: z.enum(CATEGORIES),
  subject: z.string().trim().min(2).max(255),
  comments: z.string().trim().min(5).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const id = newId();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) || null;

    await queryExec(
      `INSERT INTO contact_messages
        (id, name, email, phone, category, subject, message, status, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW', ?, ?)`,
      [
        id,
        data.name,
        data.email.toLowerCase(),
        data.phone,
        data.category,
        data.subject,
        data.comments,
        ip,
        userAgent,
      ],
    );

    return NextResponse.json({
      ok: true,
      message: "Message sent! We'll get back to you soon.",
      id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "Please fill in all fields correctly." },
        { status: 400 },
      );
    }
    console.error("Contact form error:", error);
    return NextResponse.json(
      { ok: false, message: "Could not send message. Please try again." },
      { status: 500 },
    );
  }
}
