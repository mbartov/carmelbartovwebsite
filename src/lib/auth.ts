import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { getSql } from "./db";
import { getSession } from "./session";

const MAX_FAILURES = 5;

export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new AuthError();
}

export function passphraseMatches(submitted: string) {
  const expected = process.env.ADMIN_PASSPHRASE;
  if (!expected) return false;
  const left = createHash("sha256").update(submitted).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export async function clientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headerStore.get("x-real-ip") ?? "unknown";
}

export async function isRateLimited(ip: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT count(*)::int AS count
    FROM login_attempts
    WHERE ip = ${ip}
      AND attempted_at > now() - interval '15 minutes'
  `;
  return Number(rows[0]?.count ?? 0) >= MAX_FAILURES;
}

export async function recordFailedLogin(ip: string) {
  const sql = getSql();
  await sql`
    INSERT INTO login_attempts (ip)
    VALUES (${ip})
  `;
  await sql`
    DELETE FROM login_attempts
    WHERE attempted_at < now() - interval '1 day'
  `;
}

export async function clearFailedLogins(ip: string) {
  const sql = getSql();
  await sql`DELETE FROM login_attempts WHERE ip = ${ip}`;
}
