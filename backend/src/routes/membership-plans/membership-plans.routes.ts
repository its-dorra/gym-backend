import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertMembershipSchema } from "@/db/schemas/membership.schema";
import { createMembershipPlanSchema, selectMembershipPlanSchema } from "@/db/schemas/memberships-plan.schema";
import { internalServerErrorSchema, notFoundSchema, unauthorizedSchema } from "@/lib/zod-schemas";
import { isAuthenticated } from "@/middlewares/is-authenticated";

const tags = ["Membership plans"];

export const list = createRoute({
  tags,

  method: "get",
  path: "/",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectMembershipPlanSchema), "List of membership plans"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(internalServerErrorSchema, HttpStatusPhrases.INTERNAL_SERVER_ERROR),
  },
});

export const getOne = createRoute({
  tags,
  method: "get",
  path: "/{id}",

  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectMembershipPlanSchema, "The requested membership plan"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(internalServerErrorSchema, HttpStatusPhrases.INTERNAL_SERVER_ERROR),
  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(createMembershipPlanSchema, ""),
  },

  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectMembershipPlanSchema, "The created membership plan"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertMembershipSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(internalServerErrorSchema, HttpStatusPhrases.INTERNAL_SERVER_ERROR),
  },
});

export type GetOneRoute = typeof getOne;
export type ListRoute = typeof list;
export type CreateRoute = typeof create;
