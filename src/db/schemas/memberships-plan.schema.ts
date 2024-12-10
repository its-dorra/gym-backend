import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { membershipTable } from "./membership.schema";

export const membershipPlanTable = sqliteTable("membership_plans", {
  id: int("id").primaryKey({ autoIncrement: true }),
  planName: text("plan_name").notNull(),
  price: real("price").notNull(),
  sessionsPerWeek: int("sessions_per_week").notNull(),
  strictAttendance: int("strict_attendance", { mode: "boolean" }),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const membershipPlanRelations = relations(membershipPlanTable, ({ many }) => ({
  memberships: many(membershipTable),
}));
