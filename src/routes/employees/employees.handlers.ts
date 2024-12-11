import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { getEmployees } from "@/data-access/employee";
import { catchErrorTyped } from "@/lib/utils";

import type { ListRoute } from "./employees.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const [employees, error] = await catchErrorTyped(getEmployees());

  if (error) {
    return c.json({ message: "Can't fetch employees , please try again" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return c.json(employees, HttpStatusCodes.OK);
};
