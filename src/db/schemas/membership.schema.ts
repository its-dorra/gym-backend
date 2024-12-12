import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { employeeTable } from "./employee.schema";
import { memberTable } from "./member.schema";
import { membershipPlanTable } from "./memberships-plan.schema";
import { userTable } from "./user.schema";

export const membershipTable = sqliteTable("membership", {
  id: int("id").primaryKey(),
  memberId: int("member_id").notNull().references(() => memberTable.id),
  planId: int("plan_id").notNull().references(() => membershipPlanTable.id),
  userId: int("user_id").notNull().references(() => employeeTable.id),
  startDate: int("start_date", { mode: "timestamp" }).notNull().$default(() => new Date()),
  endDate: int("end_date", { mode: "timestamp" }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
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
  employee: one(userTable, {
    fields: [membershipTable.userId],
    references: [userTable.id],
  }),
}));

export const selectMembershipSchema = createSelectSchema(membershipTable);

export const insertMembershipSchema = createInsertSchema(membershipTable).omit({ id: true, createdAt: true, updatedAt: true, userId: true }).refine(({ startDate, endDate }) => startDate! < endDate);

export const updateMembershipSchema = createInsertSchema(membershipTable).omit({ id: true, createdAt: true, updatedAt: true, userId: true }).partial().refine(({ startDate, endDate }) => startDate! < endDate!);

export type InsertedMembership = z.infer<typeof insertMembershipSchema>;
