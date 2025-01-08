import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertAttendanceSchema, selectAttendanceSchema } from "@/db/schemas/attendance.schema";
import { badRequestErrorSchema, internalServerErrorSchema, unauthorizedSchema } from "@/lib/zod-schemas";
import { isAuthenticated } from "@/middlewares/is-authenticated";

const tags = ["Attendances"];

export const list = createRoute({
  tags,
  method: "get",
  path: "/{memberId}",
  request: {
    params: z.object({
      memberId: z.number().min(1),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectAttendanceSchema), "The list of attendances of requested user"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(z.object({
      memberId: z.number().min(1),
    })), "Invalid member id error"),
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
    body: jsonContentRequired(insertAttendanceSchema, ""),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectAttendanceSchema, HttpStatusPhrases.CREATED),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, HttpStatusPhrases.UNAUTHORIZED),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestErrorSchema,
      HttpStatusPhrases.BAD_REQUEST,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertAttendanceSchema), "Invalid information error(s)"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      HttpStatusPhrases.INTERNAL_SERVER_ERROR,
    ),
  },
});


export type ListRoute = typeof list
export type CreateRoute = typeof create