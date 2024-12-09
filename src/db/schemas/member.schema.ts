import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { attendanceTable } from "./attendance.schema";
import { invoiceTable } from "./invoice.schema";
import { membershipTable } from "./membership.schema";

export const memberTable = sqliteTable("member", {
  id: int("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull().unique(),
  address: text("address"),
  imageUrl: text("image_url"),
  registrationDate: int("registration_date", { mode: "timestamp" }).notNull().$default(() => new Date()),
  active: int("active", { mode: "boolean" }).default(true),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const memberRelations = relations(memberTable, ({ many }) => ({
  memberships: many(membershipTable),
  attendance: many(attendanceTable),
  invoices: many(invoiceTable),
}));
