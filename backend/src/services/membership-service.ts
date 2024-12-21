import { eq, lt, or } from "drizzle-orm";

import { db } from "@/db";
import { membershipTable } from "@/db/schemas/membership.schema";
import { catchErrorTyped } from "@/lib/utils";

export async function toggleExpiredMemberships() {
  const [_, error] = await catchErrorTyped(db.update(membershipTable).set({ status: "expired" }).where(or(lt(membershipTable.endDate, new Date()), eq(membershipTable.sessionUsed, membershipTable.totalSessions))));

  if (error)
    throw new Error("Can't update status in membership table");
}
