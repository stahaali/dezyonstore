import { NextResponse } from "next/server";
import { z } from "zod";
import { setSession, verifyUserPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** @deprecated Prefer POST /api/auth/login with panel=admin */
export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await verifyUserPassword(body.email, body.password);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Invalid admin credentials" },
        { status: 401 },
      );
    }

    await setSession(user);
    return NextResponse.json({ ok: true, redirectTo: "/admin/orders" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }
    console.error("[admin/login]", error);
    return NextResponse.json({ ok: false, error: "Login failed" }, { status: 500 });
  }
}
