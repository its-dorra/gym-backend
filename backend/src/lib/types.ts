import type { OpenAPIHono, RouteConfig, RouteHandler, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import type { PinoLogger } from "hono-pino";

import type { Session, User } from "@/db/schemas/user.schema";

import type { queryParamSchema } from "./zod-schemas";

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
export type EmployeeId = number;
export type ProductId = number;
export type MemberId = number;
export type MembershipId = number;
export type PlanId = number;
export type MembershipPlanId = number;

export type HonoContext = Context<AppBindings>;

export type QueryParams = z.infer<typeof queryParamSchema>;


export class ErrorWithStatus extends Error {
 
  public status : number;

  constructor(message: string, status : number) {
    super(message)
    this.status = status
  }
}