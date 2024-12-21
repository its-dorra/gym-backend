import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { createMember, deleteMember, getMembers, getOneMember, updateMember } from "@/data-access/members";
import { catchErrorTyped } from "@/lib/utils";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./members.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page, pageSize } = c.req.valid("query");

  const [members, getMembersError] = await catchErrorTyped(getMembers({ page, pageSize }));

  if (getMembersError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  return c.json(members, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id: memberId } = c.req.valid("param");

  const [member, getMemberError] = await catchErrorTyped(getOneMember(memberId));

  if (getMemberError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (!member)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.json(member, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const member = c.req.valid("json");
  const { id: userId } = c.var.user;

  const [insertedMember, insertMemberError] = await catchErrorTyped(createMember(userId, member));

  if (insertMemberError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  return c.json(insertedMember, HttpStatusCodes.CREATED);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id: memberId } = c.req.valid("param");
  const member = c.req.valid("json");

  const [updatedMember, updateMemberError] = await catchErrorTyped(updateMember(memberId, member));

  if (updateMemberError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (!updatedMember)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.json(updatedMember, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id: memberId } = c.req.valid("param");

  const [result, removeMemberError] = await catchErrorTyped(deleteMember(memberId));

  if (removeMemberError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (result.rowsAffected === 0)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
