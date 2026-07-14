import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { queryRows } from "@/lib/db";

export type UserRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
};

const COOKIE_NAME = "dezyon_session";

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SESSION_SECRET ||
    "dev-secret"
  );
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function createToken(user: AuthUser) {
  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12h
  const name = encodeURIComponent(user.name || "");
  const payload = `${user.id}|${user.email}|${user.role}|${name}|${exp}`;
  return `${payload}|${sign(payload)}`;
}

function verifyToken(token: string | undefined | null): AuthUser | null {
  if (!token) return null;
  const parts = token.split("|");
  if (parts.length !== 6) return null;
  const [id, email, role, nameEnc, expStr, signature] = parts;
  const payload = `${id}|${email}|${role}|${nameEnc}|${expStr}`;
  const expected = sign(payload);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  if (Number(expStr) < Date.now()) return null;
  if (role !== "CUSTOMER" && role !== "ADMIN") return null;
  return {
    id,
    email,
    role,
    name: decodeURIComponent(nameEnc) || null,
  };
}

export async function setSession(user: AuthUser) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  // legacy admin cookie
  jar.delete("dezyon_admin_session");
}

export async function getSession(): Promise<AuthUser | null> {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE_NAME)?.value);
}

export async function getAdminSession(): Promise<AuthUser | null> {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function requireAdmin() {
  const user = await getAdminSession();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

type DbUser = RowDataPacket & {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  password_hash: string | null;
};

export async function findUserByEmail(email: string) {
  const rows = await queryRows<DbUser[]>(
    `SELECT id, email, name, role, password_hash
     FROM users WHERE email = ? LIMIT 1`,
    [email.trim().toLowerCase()],
  );
  return rows[0] ?? null;
}

export async function verifyUserPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user?.password_hash) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  } satisfies AuthUser;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export { COOKIE_NAME };
