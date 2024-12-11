import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { insertEmployeeSchema, selectEmployeeSchema } from "@/db/schemas/employee.schema";
import { insertUserSchema, selectUserSchema } from "@/db/schemas/user.schema";
import { forbiddenSchema, internalServerErrorSchema, unauthorizedSchema } from "@/lib/zod-schemas";

const tags = ["Employees"];

export const list = createRoute({
  tags,
  method: "get",
  path: "/employees",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectEmployeeSchema), "The list of employees"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, HttpStatusPhrases.FORBIDDEN),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/employees",
  request: {
    body: jsonContentRequired(insertUserSchema.merge(insertEmployeeSchema), ""),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectUserSchema.merge(selectEmployeeSchema), "The created Employee"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, HttpStatusPhrases.FORBIDDEN),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),

  },
});

export type ListRoute = typeof list;
