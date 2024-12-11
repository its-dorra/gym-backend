import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertProductSchema, selectProductSchema, updateProductSchema } from "@/db/schemas/product.schema";
import { notFoundSchema, unauthorizedSchema } from "@/lib/zod-schemas";

const tags = ["Products"];

export const list = createRoute({
  tags,
  method: "get",
  path: "/products",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectProductSchema), "The list of products"),
  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/products",
  request: {
    body: jsonContentRequired(insertProductSchema, "The product to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectProductSchema, "The created product"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(createMessageObjectSchema(), "Unauthorized access"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertProductSchema), "Invalid product error(s)"),
  },
});

export const getOne = createRoute({
  tags,
  method: "get",
  path: "/products/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectProductSchema, "The requested product"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Product not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
  },
});

export const patch = createRoute({
  tags,
  method: "patch",
  path: "/products/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateProductSchema, "The product to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectProductSchema, "The updated product"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized access"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Product not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf([createErrorSchema(updateProductSchema), (createErrorSchema(IdParamsSchema))], "Invalid validation error(s)"),
  },
});

export const remove = createRoute({
  tags,
  method: "delete",
  path: "/products/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Product deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
  },
});

export type ListRoute = typeof list;
export type CreateProductRoute = typeof create;
export type GetOneProductRoute = typeof getOne;
export type UpdateProductRoute = typeof patch;
export type DeleteProductRoute = typeof remove;
