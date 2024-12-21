import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
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
  // endDate: int("end_date", { mode: "timestamp" }).notNull(),
  status: text("status", { enum: ["active", "expired"] }).notNull().default("active"),
  sessionUsed: int("sessions_used").notNull().default(0),
  price: real("price").notNull(),
  totalSessions: int("sessions_per_week").notNull(),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
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
  user: one(userTable, {
    fields: [membershipTable.userId],
    references: [userTable.id],
  }),
}));

export const selectMembershipSchema = createSelectSchema(membershipTable);

export const insertMembershipSchema = createInsertSchema(membershipTable).omit({ id: true, createdAt: true, updatedAt: true, userId: true, deletedAt: true, totalSessions: true, price: true, sessionUsed: true, startDate: true, status: true });

export const updateMembershipSchema = createInsertSchema(membershipTable).omit({ id: true, createdAt: true, updatedAt: true, userId: true, deletedAt: true, status: true }).partial();

export type InsertedMembership = z.infer<typeof insertMembershipSchema>;
