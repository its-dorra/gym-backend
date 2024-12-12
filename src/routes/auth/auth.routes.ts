import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { insertUserSchema, selectUserSchema } from "@/db/schemas/user.schema";
import { internalServerErrorSchema, unauthorizedSchema } from "@/lib/zod-schemas";

const tags = ["Authentication"];

export const login = createRoute({
  tags,
  path: "/login",
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
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export const logout = createRoute({
  tags,
  path: "/logout",
  method: "post",
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Logout",
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export const user = createRoute({
  tags,
  path: "/user",
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
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export type LoginRoute = typeof login;
export type LogoutRoute = typeof logout;
export type UserRoute = typeof user;
