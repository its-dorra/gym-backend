import { eq } from "drizzle-orm";

import type { MembershipId, UserId } from "@/lib/types";

import { db } from "@/db";
import { type InsertedMembership, membershipTable } from "@/db/schemas/membership.schema";
import { catchErrorTyped } from "@/lib/utils";

import { getOneMembershipPlan } from "./membership-plans";

export function getOneMembership(membershipId: MembershipId) {
  return db.query.membershipTable.findFirst({ where: eq(membershipTable.id, membershipId) });
}

export async function createMembership(userId: UserId, membership: InsertedMembership) {
  const [membershipPlan, error] = await catchErrorTyped(getOneMembershipPlan(membership.planId));

  if (error)
    throw error;

  if (!membershipPlan)
    throw new Error("There's no plan for this id");

  const { price, totalSessions } = membershipPlan;

  return db.insert(membershipTable).values({ ...membership, userId, price, totalSessions }).returning().then(res => res[0]);
}

export function updateMembership(userId: UserId, membershipId: MembershipId, updatedMembership: Partial<InsertedMembership>) {
  return db.update(membershipTable).set({ ...updatedMembership, userId }).where(eq(membershipTable.id, membershipId)).returning().then(res => res[0]);
}

export function deleteMembership(membershipId: MembershipId) {
  return db.update(membershipTable).set({ deletedAt: new Date() }).where(eq(membershipTable.id, membershipId));
}
