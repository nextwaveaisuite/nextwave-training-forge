// lib/auth.ts

import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Simple Session Auth (Phase 1)
 * -----------------------------
 * Email-based sessions
 * HttpOnly cookies
 * No passwords
 * Expandable to DB later
 */

export type UserTier = "FREE" | "PRO";

const SESSION_COOKIE = "nw_session";
const SESSION_TTL_HOURS = 24;

interface SessionData {
  email: string;
  tier: UserTier;
  exp: number;
}

// In-memory session store (Phase 1 only)
const sessions = new Map<string, SessionData>();

export function startSession(email: string) {
  const token = crypto.randomBytes(32).toString("hex");

  sessions.set(token, {
    email,
    tier: "FREE",
    exp: Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000,
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

export function getSession(): SessionData | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = sessions.get(token);
  if (!session || session.exp < Date.now()) {
    sessions.delete(token);
    return null;
  }

  return session;
}

export function endSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) sessions.delete(token);
  cookies().delete(SESSION_COOKIE);
}

/**
 * Upgrade user to PRO after payment
 */
export function upgradeSessionTier(email: string) {
  for (const session of sessions.values()) {
    if (session.email === email) {
      session.tier = "PRO";
    }
  }
}
