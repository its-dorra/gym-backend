import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { createMembershipPlan, getMembershipPlans, getOneMembershipPlan } from "@/data-access/membership-plans";
import { catchErrorTyped } from "@/lib/utils";

import type { CreateRoute, GetOneRoute, ListRoute } from "./membership-plans.routes";

export const list: AppRouteHandler <ListRoute> = async (c) => {
  const [result, error] = await catchErrorTyped(getMembershipPlans());

  if (error)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  return c.json(result, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id: membershipPlanId } = c.req.valid("param");

  const [membershipPlan, getMembershipPlanError] = await catchErrorTyped(getOneMembershipPlan(membershipPlanId));

  if (getMembershipPlanError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (!membershipPlan)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.json(membershipPlan, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const newMembershipPlan = c.req.valid("json");

  const [result, error] = await catchErrorTyped(createMembershipPlan(newMembershipPlan));

  if (error)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  return c.json(result, HttpStatusCodes.CREATED);
};
