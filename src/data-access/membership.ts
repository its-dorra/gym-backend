import { eq } from "drizzle-orm";

import type { EmployeeId, MemberId, MembershipId, PlanId, UserId } from "@/lib/types";

import { db } from "@/db";
import { type InsertedMembership, membershipTable } from "@/db/schemas/membership.schema";

export function getOneMembership(membershipId: MembershipId) {
  return db.query.membershipTable.findFirst({ where: eq(membershipTable.id, membershipId) });
}

export function createMembership(userId: UserId, membership: InsertedMembership) {
  return db.insert(membershipTable).values({ ...membership, userId }).returning().then(res => res[0]);
}

export function updateMembership(userId: UserId, membershipId: MembershipId, updatedMembership: Partial<InsertedMembership>) {
  return db.update(membershipTable).set({ ...updatedMembership, userId }).where(eq(membershipTable.id, membershipId)).returning().then(res => res[0]);
}

export function deleteMembership(membershipId: MembershipId) {
  return db.delete(membershipTable).where(eq(membershipTable.id, membershipId));
}
