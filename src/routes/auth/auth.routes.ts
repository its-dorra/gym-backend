import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Authentication"];

export const login = createRoute({
  tags,
  path: "/login",
  method: "post",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema(),
      "Login route",
    ),
  },
});

export type LoginRoute = typeof login;
