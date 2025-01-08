import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { z, type ZodObject, type ZodRawShape } from "zod";

import { PAGE_SIZE } from "./app-config";

export const queryParamSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(PAGE_SIZE),
});

export function extendZodSchemaByPaginationSchema<T extends ZodRawShape>(schema: ZodObject<T>) {
  return z.object({
    data: z.array(schema),
    currentPage: z.number().positive(),
    totalCount: z.number().positive(),
    totalPages: z.number().positive(),

  });
}

export const okSchema = createMessageObjectSchema(HttpStatusPhrases.OK);

export const createdSchema = createMessageObjectSchema(HttpStatusPhrases.CREATED);

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);

export const unauthorizedSchema = createMessageObjectSchema(HttpStatusPhrases.UNAUTHORIZED);

export const forbiddenSchema = createMessageObjectSchema(HttpStatusPhrases.FORBIDDEN);

export const internalServerErrorSchema = createMessageObjectSchema(HttpStatusPhrases.INTERNAL_SERVER_ERROR);

export const badRequestErrorSchema = createMessageObjectSchema(HttpStatusPhrases.BAD_REQUEST);

export const tooManyRequestsSchema = createMessageObjectSchema(HttpStatusPhrases.TOO_MANY_REQUESTS);
