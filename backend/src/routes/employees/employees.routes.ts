import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertEmployeeSchema, selectEmployeeSchema, updateEmployeeSchema } from "@/db/schemas/employee.schema";
import { insertUserSchema } from "@/db/schemas/user.schema";
import { createdSchema, extendZodSchemaByPaginationSchema, forbiddenSchema, internalServerErrorSchema, notFoundSchema, okSchema, queryParamSchema, unauthorizedSchema } from "@/lib/zod-schemas";

const tags = ["Employees"];

export const list = createRoute({
  tags,
  method: "get",
  path: "/",
  request: {
    query: queryParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(extendZodSchemaByPaginationSchema(selectEmployeeSchema), "The list of employees"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, HttpStatusPhrases.FORBIDDEN),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(queryParamSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      HttpStatusPhrases.INTERNAL_SERVER_ERROR,
    ),
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
    [HttpStatusCodes.OK]: jsonContent(selectEmployeeSchema, "The requested employee"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, HttpStatusPhrases.FORBIDDEN),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Employee not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      HttpStatusPhrases.INTERNAL_SERVER_ERROR,
    ),

  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertUserSchema.merge(insertEmployeeSchema), ""),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(createdSchema, HttpStatusPhrases.CREATED),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, HttpStatusPhrases.FORBIDDEN),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertUserSchema.merge(insertEmployeeSchema)), "Invalid product error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      HttpStatusPhrases.INTERNAL_SERVER_ERROR,
    ),
  },
});

export const patch = createRoute({
  tags,
  method: "patch",
  path: "/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateEmployeeSchema, "The employee to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(okSchema, "Employee updated successfully"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized access"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, HttpStatusPhrases.FORBIDDEN),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Product not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf([createErrorSchema(updateEmployeeSchema), (createErrorSchema(IdParamsSchema))], "Invalid validation error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      HttpStatusPhrases.INTERNAL_SERVER_ERROR,
    ),
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
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Employee deleted",
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized access"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, HttpStatusPhrases.FORBIDDEN),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Product not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      HttpStatusPhrases.INTERNAL_SERVER_ERROR,
    ),

  },
});

export type ListRoute = typeof list;
export type GetOneRoute = typeof getOne;
export type CreateRoute = typeof create;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
