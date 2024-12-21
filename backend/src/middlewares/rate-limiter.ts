import type { Context, Next } from "hono";

import { and, eq, gt, sql } from "drizzle-orm";

import type { AppBindings } from "@/lib/types";

import { db } from "@/db";
import { rateLimitAttempts } from "@/db/schemas/rate-limit.schema";

interface RateLimitConfig {
  limit?: number;
  windowMs?: number;
}

export function createRateLimiter({
  limit = 5,
  windowMs = 15 * 60 * 1000,
}: RateLimitConfig = {}) {
  return async (c: Context<AppBindings>, next: Next) => {
    const ip = c.req.header("x-forwarded-for")
      || c.req.header("x-real-ip")
      || "127.0.0.1";

    const attempts = await db
      .query
      .rateLimitAttempts
      .findMany({ where: and(
        eq(rateLimitAttempts.ip, ip),
        gt(rateLimitAttempts.timestamp, new Date(Date.now() - windowMs)),
      ) });

    if (attempts.length >= limit) {
      return c.json({
        error: "Too many attempts. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000 / 60),
      }, 429);
    }

    await db.insert(rateLimitAttempts).values({
      ip,
      timestamp: new Date(),
      route: c.req.path,
    });

    await next();
  };
}
