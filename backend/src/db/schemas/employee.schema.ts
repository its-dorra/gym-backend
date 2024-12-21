import { relations } from "drizzle-orm";
import { int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { invoiceTable } from "./invoice.schema";
import { memberTable } from "./member.schema";
import { userTable } from "./user.schema";

export const employeeTable = sqliteTable("employee", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id").notNull().references(() => userTable.id),
  fullName: text("fullname").notNull(),
  imageUrl: text("image_url").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  hireDate: int("hire_date", { mode: "timestamp" }).notNull().$default(() => new Date()),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
}, table => ({
  userIdIdx: uniqueIndex("user_id_idx").on(table.userId),
}));

export const employeeRelations = relations(employeeTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [employeeTable.userId],
    references: [userTable.id],
  }),
  invoices: many(invoiceTable),
}));

export const insertEmployeeSchema = createInsertSchema(employeeTable, {
  imageUrl: z.string().url(),
}).omit({ createdAt: true, updatedAt: true, userId: true, id: true, deletedAt: true });

export const updateEmployeeSchema = insertEmployeeSchema.partial();

export const selectEmployeeSchema = createSelectSchema(employeeTable);

export type Employee = z.infer<typeof insertEmployeeSchema>;
