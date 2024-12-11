import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppBindings } from "@/lib/types";

import { getCurrentUser } from "@/auth";

export const isAuthenticated = createMiddleware<AppBindings>(async (c, next) => {
  const user = await getCurrentUser(c);

  if (!user) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  c.set("user", user);
  await next();
});
