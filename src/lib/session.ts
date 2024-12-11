import type { Context } from "hono";

import {
  getCookie,
  setCookie,
} from "hono/cookie";

import { createSession, generateSessionToken, invalidateSession } from "@/auth";
import env from "@/env";

import type { HonoContext, UserId } from "./types";

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
  const sessionId = getSessionToken(c);
  if (!sessionId)
    return;
  await invalidateSession(sessionId);
  deleteSessionTokenCookie(c);
}
