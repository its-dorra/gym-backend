import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { invoiceTable } from "./invoice.schema";
import { membershipTable } from "./membership.schema";
import { userTable } from "./user.schema";

export const employeeTable = sqliteTable("employee", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id").notNull().references(() => userTable.id),
  fullName: text("fullname").notNull(),
  imageUrl: text("image_url").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  hireDate: int("hire_date", { mode: "timestamp" }).notNull().$default(() => new Date()),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const employeeRelations = relations(employeeTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [employeeTable.userId],
    references: [userTable.id],
  }),
  memberships: many(membershipTable),
  invoices: many(invoiceTable),
}));
