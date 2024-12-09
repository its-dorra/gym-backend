import type { AppRouteHandler } from "@/lib/types";

import type { LoginRoute } from "./auth.routes";

export const login: AppRouteHandler<LoginRoute> = (c) => {
  return c.json({ message: "logging successfully" });
};
