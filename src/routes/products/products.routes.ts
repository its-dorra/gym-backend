import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { insertProductSchema, selectProductSchema } from "@/db/schemas/product.schema";

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
  },
});

export const getOne = createRoute({
  tags,
  method: "get",
  path: "/products/{id}",
  request: {
    params: z.object({
      id: z.string().describe("The unique identifier of the product"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectProductSchema, "Details of the specific product"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(),
      "Product not found",
    ),
  },
});
