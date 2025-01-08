import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertMemberSchema, selectMemberSchema, updateMemberSchema } from "@/db/schemas/member.schema";
import { extendZodSchemaByPaginationSchema, internalServerErrorSchema, notFoundSchema, queryParamSchema, unauthorizedSchema } from "@/lib/zod-schemas";

const tags = ["Members"];

export const list = createRoute({
  tags,
   
  path: "/",
  method: "get",
  request: {
    query: queryParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(extendZodSchemaByPaginationSchema(selectMemberSchema), "List of members"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(internalServerErrorSchema, HttpStatusPhrases.INTERNAL_SERVER_ERROR),
  },
});

export const getOne = createRoute({
  tags,
  path: "/{id}",
  method: "get",
   
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectMemberSchema, "The requested member"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(internalServerErrorSchema, HttpStatusPhrases.INTERNAL_SERVER_ERROR),
  },
});

export const create = createRoute({
  tags,
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertMemberSchema, "The member to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectMemberSchema, HttpStatusPhrases.CREATED),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertMemberSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(internalServerErrorSchema, HttpStatusPhrases.INTERNAL_SERVER_ERROR),
  },
});

export const patch = createRoute({
  tags,
  path: "/{id}",
  method: "patch",
   
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateMemberSchema, "The member to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectMemberSchema, HttpStatusPhrases.OK),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf([createErrorSchema(insertMemberSchema), createErrorSchema(IdParamsSchema)], "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(internalServerErrorSchema, HttpStatusPhrases.INTERNAL_SERVER_ERROR),
  },
});

export const remove = createRoute({
  tags,
  method: "delete",
  path: "/{id}",
   
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: "Member deleted" },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(internalServerErrorSchema, HttpStatusPhrases.INTERNAL_SERVER_ERROR),
  },
});

export type ListRoute = typeof list;
export type GetOneRoute = typeof getOne;
export type CreateRoute = typeof create;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
