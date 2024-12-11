import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { insertUserSchema, selectUserSchema } from "@/db/schemas/user.schema";
import { unauthorizedSchema } from "@/lib/zod-schemas";

const tags = ["Authentication"];

export const login = createRoute({
  tags,
  path: "/auth/login",
  method: "post",
  request: {
    body: jsonContentRequired(insertUserSchema.omit({ role: true }), ""),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserSchema,
      "Login route",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Invalid credentials"),
      "Invalid credentials",
    ),
  },
});

export const user = createRoute({
  tags,
  path: "/auth/user",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserSchema,
      "Login route",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      HttpStatusPhrases.UNAUTHORIZED,
    ),
  },
});

export type LoginRoute = typeof login;
export type UserRoute = typeof user;
