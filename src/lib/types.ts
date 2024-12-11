import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

import type { Session, User } from "@/db/schemas/user.schema";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    user: User;
    session: Session;
  };
}

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBindings>;

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type UserId = number;
