import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { createMembership, deleteMembership, getOneMembership, updateMembership } from "@/data-access/memberships";
import { catchErrorTyped } from "@/lib/utils";

import type { CreateRoute, GetOneRoute, PatchRoute, RemoveRoute } from "./memberships.routes";

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const membership = c.req.valid("json");
  const { id: userId } = c.var.user;

  const [insertedMembership, createMembershipError] = await catchErrorTyped(createMembership(userId, membership.planId, membership));

  if (createMembershipError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  return c.json(insertedMembership, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id: membershipId } = c.req.valid("param");

  const [storedMembership, getMembershipError] = await catchErrorTyped(getOneMembership(membershipId));

  if (getMembershipError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (!storedMembership)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.json(storedMembership, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const membership = c.req.valid("json");
  const { id: membershipId } = c.req.valid("param");
  const { id: userId } = c.var.user;

  const [updatedMembership, updateMembershipError] = await catchErrorTyped(updateMembership(userId, membershipId, membership));

  if (updateMembershipError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (!updatedMembership)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.json(updatedMembership, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id: membershipId } = c.req.valid("param");

  const [result, removeMembershipError] = await catchErrorTyped(deleteMembership(membershipId));

  if (removeMembershipError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (result.rowsAffected === 0)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
