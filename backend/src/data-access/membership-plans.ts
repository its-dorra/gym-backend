import { eq } from "drizzle-orm";

import type { MembershipPlanId } from "@/lib/types";

import { db } from "@/db";
import { membershipPlanTable } from "@/db/schemas/memberships-plan.schema";

export function getMembershipPlans() {
  return db.query.membershipPlanTable.findMany();
}

export function getOneMembershipPlan(membershipPlanId: MembershipPlanId) {
  return db.query.membershipPlanTable.findFirst({ where: eq(membershipPlanTable.id, membershipPlanId) });
}
