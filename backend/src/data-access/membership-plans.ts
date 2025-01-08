import type { z } from "zod";

import { eq } from "drizzle-orm";

import type { createMembershipPlanSchema } from "@/db/schemas/memberships-plan.schema";
import type { MembershipPlanId } from "@/lib/types";

import { db } from "@/db";
import { membershipPlanTable } from "@/db/schemas/memberships-plan.schema";

export function getMembershipPlans() {
  return db.query.membershipPlanTable.findMany();
}

export function getOneMembershipPlan(membershipPlanId: MembershipPlanId) {
  return db.query.membershipPlanTable.findFirst({ where: eq(membershipPlanTable.id, membershipPlanId) });
}

export function createMembershipPlan(membershipPlan: z.infer<typeof createMembershipPlanSchema>) {
  return db.insert(membershipPlanTable).values(membershipPlan).returning().then(res => res?.[0]);
}
