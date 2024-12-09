import { relations } from "drizzle-orm";
import { int, sqliteTable } from "drizzle-orm/sqlite-core";

import { employeeTable } from "./employee.schema";
import { memberTable } from "./member.schema";
import { membershipPlanTable } from "./memberships-plan.schema";

export const membershipTable = sqliteTable("membership", {
  id: int("id").primaryKey(),
  memberId: int("member_id").notNull().references(() => memberTable.id),
  planId: int("plan_id").notNull().references(() => membershipPlanTable.id),
  employeeId: int("employee_id").references(() => employeeTable.id),
  startDate: int("start_date", { mode: "timestamp" }).notNull().$default(() => new Date()),
  endDate: int("end_date").notNull(),
});

export const membershipRelations = relations(membershipTable, ({ one }) => ({
  member: one(memberTable, {
    fields: [membershipTable.memberId],
    references: [memberTable.id],
  }),
  membershipPlan: one(membershipPlanTable, {
    fields: [membershipTable.planId],
    references: [membershipPlanTable.id],
  }),
  employee : one(employeeTable, {
    fields : [membershipTable.employeeId],
    references : [employeeTable.id]
  })
}));
