import { NextResponse } from "next/server";
import { z } from "zod";
import { setSession, verifyUserPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  panel: z.enum(["user", "admin"]).default("user"),
});

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await verifyUserPassword(body.email, body.password);

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (body.panel === "admin" && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          ok: false,
          error: "This account is not an admin. Use User login instead.",
        },
        { status: 403 },
      );
    }

    if (body.panel === "user" && user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          ok: false,
          error: "This is an admin account. Switch to Admin login.",
        },
        { status: 403 },
      );
    }

    await setSession(user);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      redirectTo: user.role === "ADMIN" ? "/admin/orders" : "/account",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }
    console.error("[auth/login]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Login failed. Check MySQL connection and that seed users exist in the users table.",
      },
      { status: 500 },
    );
  }
}
