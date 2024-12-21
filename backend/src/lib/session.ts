import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import {
  getCookie,
  setCookie,
} from "hono/cookie";

import type { HonoContext, UserId } from "@/lib/types";

import { createSession, generateSessionToken, invalidateSession } from "@/auth";
import env from "@/env";

const SESSION_COOKIE_NAME = "session";

export function setSessionTokenCookie(c: HonoContext, token: string, expiresAt: Date): void {
  setCookie(c, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export function deleteSessionTokenCookie(c: HonoContext): void {
  setCookie(c, SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export function getSessionToken(c: HonoContext): string | undefined {
  return getCookie(c, SESSION_COOKIE_NAME);
}

export async function setSession(c: HonoContext, userId: UserId) {
  const token = generateSessionToken();
  const session = await createSession(token, userId);
  setSessionTokenCookie(c, token, session.expiresAt);
}

export async function deleteSession(c: HonoContext) {
  const token = getSessionToken(c);
  if (!token)
    return;
  await invalidateSession(token);
  deleteSessionTokenCookie(c);
}

export function createSessionIdFromToken(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}
