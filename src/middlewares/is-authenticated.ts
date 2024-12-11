import { createMiddleware } from "hono/factory";

import type { AppBindings } from "@/lib/types";

import { assertAuthenticated } from "@/auth";

export const isAuthenticated = createMiddleware<AppBindings>(async (c, next) => {
  const user = await assertAuthenticated(c);
  c.set("user", user);
  await next();
});
