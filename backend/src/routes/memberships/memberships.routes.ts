import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertMembershipSchema, selectMembershipSchema, updateMembershipSchema } from "@/db/schemas/membership.schema";
import { internalServerErrorSchema, notFoundSchema, unauthorizedSchema } from "@/lib/zod-schemas";

const tags = ["Memberships"];

export const create = createRoute({
  tags,
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertMembershipSchema, "The membership to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectMembershipSchema, "The created membership"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertMembershipSchema), "Invalid membership error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export const getOne = createRoute({
  tags,
  method: "get",
  path: "/{memberId}/history/{id}",
  request: {
    params: IdParamsSchema.extend({ memberId: z.coerce.number() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectMembershipSchema, "The requested membership"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema.extend({ memberId: z.coerce.number() })), "Invalid membership error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export const patch = createRoute({
  tags,
  method: "patch",
  path: "/{memberId}/history/{id}",
  request: {
    params: IdParamsSchema.extend({ memberId: z.coerce.number() }),
    body: jsonContentRequired(updateMembershipSchema, "The membership to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectMembershipSchema, "The requested membership"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf([createErrorSchema(IdParamsSchema.extend({ memberId: z.coerce.number() })), createErrorSchema(updateMembershipSchema)], "Validation error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export const remove = createRoute({
  tags,
  method: "delete",
  path: "/{memberId}/history/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: "Membership deleted" },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized access"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema.extend({ memberId: z.coerce.number() })), "Invalid membership error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
