// lib/auth.ts
import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "nw_session";
const SESSION_TTL_HOURS = 24;

// In-memory store (Phase 1)
// Phase 2 → DB / Redis
const sessions = new Map<string, { email: string; tier: "FREE" | "PRO"; exp: number }>();

export function startSession(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const exp = Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000;

  sessions.set(token, { email, tier: "PRO", exp });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

export function endSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) sessions.delete(token);
  cookies().delete(SESSION_COOKIE);
}

export function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = sessions.get(token);
  if (!session || session.exp < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}
