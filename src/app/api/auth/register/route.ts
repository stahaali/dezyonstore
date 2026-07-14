import { NextResponse } from "next/server";
import { z } from "zod";
import { newId } from "@/lib/db";
import { queryExec, queryRows } from "@/lib/db";
import { hashPassword, setSession } from "@/lib/auth";
import type { RowDataPacket } from "mysql2";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const email = body.email.trim().toLowerCase();

    const existing = await queryRows<RowDataPacket[]>(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email],
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Email already registered" },
        { status: 409 },
      );
    }

    const id = newId();
    const passwordHash = await hashPassword(body.password);

    await queryExec(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'CUSTOMER')`,
      [id, body.name.trim(), email, passwordHash],
    );

    const user = {
      id,
      email,
      name: body.name.trim(),
      role: "CUSTOMER" as const,
    };
    await setSession(user);

    return NextResponse.json({
      ok: true,
      user,
      redirectTo: "/account",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }
    console.error("[auth/register]", error);
    return NextResponse.json(
      { ok: false, error: "Registration failed. Check database connection." },
      { status: 500 },
    );
  }
}
