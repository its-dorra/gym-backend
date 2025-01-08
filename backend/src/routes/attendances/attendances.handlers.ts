import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { addAttendance, getAttendancesByMemberId } from "@/data-access/attendance";
import { type AppRouteHandler, ErrorWithStatus } from "@/lib/types";
import { catchErrorTyped } from "@/lib/utils";

import type { CreateRoute, ListRoute } from "./attendances.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { memberId } = c.req.valid("param");

  const [result, error] = await catchErrorTyped(getAttendancesByMemberId(memberId));

  if (error) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return c.json(result, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { memberId, checkInTime } = c.req.valid("json");

  const [result, error] = await catchErrorTyped(addAttendance(memberId, checkInTime));

  if (error instanceof ErrorWithStatus) {
    return c.json({ message: error.message }, HttpStatusCodes.BAD_REQUEST);
  }
  if (error) {
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return c.json(result, HttpStatusCodes.CREATED);
};
