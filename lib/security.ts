// lib/security.ts

/**
 * Security & Abuse Protection Layer
 * --------------------------------
 * Centralised protections used by:
 * - API routes
 * - Engine entry points
 * - Prompt handlers
 *
 * Design goals:
 * ✅ Prevent prompt injection
 * ✅ Prevent overuse & abuse
 * ✅ Sanitize all user-controlled input
 * ✅ Provide hooks for rate limiting & audits
 */

const MAX_STRING_LENGTH = 5_000;
const MAX_ARRAY_LENGTH = 50;

const BLOCKED_PATTERNS = [
  /system\s*:/i,
  /assistant\s*:/i,
  /developer\s*:/i,
  /ignore\s+previous/i,
  /bypass/i,
  /jailbreak/i,
  /override/i,
  /execute\s+code/i,
  /function\s*\(/i,
  /process\.env/i,
];

/**
 * SANITISE STRING INPUT
 * ---------------------
 * Strips dangerous instructions while keeping meaning.
 */
export function sanitizeString(input: string): string {
  if (!input) return "";

  let clean = input.slice(0, MAX_STRING_LENGTH);

  BLOCKED_PATTERNS.forEach((pattern) => {
    clean = clean.replace(pattern, "[redacted]");
  });

  return clean.trim();
}

/**
 * SANITISE OBJECT INPUT
 * ---------------------
 * Recursively sanitises all string fields.
 */
export function sanitizeObject<T>(input: T): T {
  if (input === null || input === undefined) return input;

  if (typeof input === "string") {
    return sanitizeString(input) as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.slice(0, MAX_ARRAY_LENGTH).map((item) =>
      sanitizeObject(item)
    ) as unknown as T;
  }

  if (typeof input === "object") {
    const out: any = {};
    Object.entries(input as any).forEach(([key, value]) => {
      out[key] = sanitizeObject(value);
    });
    return out;
  }

  return input;
}

/**
 * INPUT VALIDATION
 * ----------------
 * Throws HARD errors on invalid input.
 */
export function assertValidInput(condition: any, message: string) {
  if (!condition) {
    throw new Error(`SECURITY_VALIDATION_FAILED: ${message}`);
  }
}

/**
 * BASIC RATE-LIMIT HOOK (v1)
 * -------------------------
 * This is a simple hook.
 * In Phase 2 this connects to Redis / Edge limits.
 */
const requestCounts = new Map<string, number>();

export function checkRateLimit(
  key: string,
  limit = 25
) {
  const current = requestCounts.get(key) || 0;

  if (current >= limit) {
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  requestCounts.set(key, current + 1);
}

/**
 * AUDIT LOG HOOK
 * -------------
 * Phase 1: console-based
 * Phase 2: persistent store / SIEM
 */
export function auditLog(
  userId: string,
  action: string,
  meta?: Record<string, any>
) {
  console.info("[AUDIT]", {
    time: new Date().toISOString(),
    userId,
    action,
    meta,
  });
}

/**
 * FUTURE EXTENSIONS (NO BREAKING CHANGES)
 * --------------------------------------
 * - Distributed rate limiting
 * - AI anomaly detection
 * - SIEM / log shipping
 * - Device fingerprinting
 * - Bot pattern analysis
 * - Attack scoring
 */
