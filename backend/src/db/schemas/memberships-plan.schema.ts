import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { membershipTable } from "./membership.schema";



export const membershipPlanTable = sqliteTable("membership_plans", {
  id: int("id").primaryKey({ autoIncrement: true }),
  planName: text("plan_name").notNull(),
  price: real("price").notNull(),
  totalSessions: int("total_sessions").notNull(),
  strictAttendance: int("strict_attendance", { mode: "boolean" }),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const membershipPlanRelations = relations(membershipPlanTable, ({ many }) => ({
  memberships: many(membershipTable),
}));

export const selectMembershipPlanSchema = createSelectSchema(membershipPlanTable);
export const createMembershipPlanSchema = createInsertSchema(membershipPlanTable).omit({id: true , createdAt : true , updatedAt : true , deletedAt : true})