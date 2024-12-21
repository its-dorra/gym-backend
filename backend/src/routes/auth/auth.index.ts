import { rateLimiter } from "hono-rate-limiter";

import { createRouter } from "@/lib/create-app";
import { createRateLimiter } from "@/middlewares/rate-limiter";

import * as handlers from "./auth.handlers";
import * as routes from "./auth.routes";

const router = createRouter();

router.use("/login", createRateLimiter());

router
  .openapi(routes.login, handlers.login)
  .openapi(routes.user, handlers.user)
  .openapi(routes.logout, handlers.logout);

export default router;
