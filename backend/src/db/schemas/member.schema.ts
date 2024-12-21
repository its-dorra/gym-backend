import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { attendanceTable } from "./attendance.schema";
import { employeeTable } from "./employee.schema";
import { invoiceTable } from "./invoice.schema";
import { membershipTable } from "./membership.schema";
import { userTable } from "./user.schema";

export const memberTable = sqliteTable("member", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id").notNull().unique().references(() => employeeTable.id),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull().unique(),
  address: text("address"),
  imageUrl: text("image_url"),
  registrationDate: int("registration_date", { mode: "timestamp" }).notNull().$default(() => new Date()),
  active: int("active", { mode: "boolean" }).default(true),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const memberRelations = relations(memberTable, ({ one, many }) => ({
  memberships: many(membershipTable),
  attendance: many(attendanceTable),
  invoices: many(invoiceTable),
  employee: one(userTable, {
    fields: [memberTable.userId],
    references: [userTable.id],
  }),
}));

export const insertMemberSchema = createInsertSchema(memberTable).omit({ id: true, userId: true, deletedAt: true, createdAt: true, updatedAt: true });

export const updateMemberSchema = insertMemberSchema.partial();

export const selectMemberSchema = createSelectSchema(memberTable);

export type InsertedMember = z.infer<typeof insertMemberSchema>;
