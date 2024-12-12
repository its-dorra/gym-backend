import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertProductSchema, selectProductSchema, updateProductSchema } from "@/db/schemas/product.schema";
import { internalServerErrorSchema, notFoundSchema, queryParamSchema, unauthorizedSchema } from "@/lib/zod-schemas";

const tags = ["Products"];

export const list = createRoute({
  tags,
  method: "get",
  path: "/",
  request: {
    query: queryParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectProductSchema), "The list of products"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(queryParamSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertProductSchema, "The product to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectProductSchema, "The created product"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized access"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertProductSchema), "Invalid product error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
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
    [HttpStatusCodes.OK]: jsonContent(selectProductSchema, "The requested product"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Product not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export const patch = createRoute({
  tags,
  method: "patch",
  path: "/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateProductSchema, "The product to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectProductSchema, "The updated product"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized access"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Product not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf([createErrorSchema(updateProductSchema), (createErrorSchema(IdParamsSchema))], "Invalid validation error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
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
      description: "Product deleted",
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error(s)",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateProductRoute = typeof create;
export type GetOneProductRoute = typeof getOne;
export type UpdateProductRoute = typeof patch;
export type DeleteProductRoute = typeof remove;
