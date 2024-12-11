import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppBindings } from "@/lib/types";

export const isAdmin = createMiddleware<AppBindings>(async (c, next) => {
  const currentUser = c.var.user;
  if (currentUser?.role !== "admin") {
    return c.json({ message: HttpStatusPhrases.FORBIDDEN }, HttpStatusCodes.FORBIDDEN);
  }

  await next();
});
