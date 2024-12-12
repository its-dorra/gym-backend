import type { Context } from "hono";

import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { type Session, sessionTable, type User, userTable } from "@/db/schemas/user.schema";
import { SESSION_MAX_AGE } from "@/lib/app-config";
import { getSessionToken } from "@/lib/session";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE),
  } satisfies Session;

  await db.insert(sessionTable).values(session);

  return session;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select({ user: { id: userTable.id, username: userTable.username, role: userTable.role }, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));

  if (result.length < 1) {
    return { session: null, user: null };
  }

  const { user, session } = result[0];

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  return { session, user };
}

export async function validateRequest(c: Context): Promise<SessionValidationResult> {
  const sessionToken = getSessionToken(c);
  if (!sessionToken) {
    return { session: null, user: null };
  }
  return validateSessionToken(sessionToken);
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export async function getCurrentUser(c: Context) {
  const { user } = await validateRequest(c);
  return user ?? undefined;
}
