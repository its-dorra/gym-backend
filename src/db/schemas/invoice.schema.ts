import { relations } from "drizzle-orm";
import { int, sqliteTable } from "drizzle-orm/sqlite-core";

import { employeeTable } from "./employee.schema";
import { invoiceLineTable } from "./invoice-line.schema";
import { memberTable } from "./member.schema";

export const invoiceTable = sqliteTable("invoice", {
  id: int("id").primaryKey({ autoIncrement: true }),
  memberId: int("member_id").notNull().references(() => memberTable.id),
  employeeId: int("employee_id").notNull().references(() => employeeTable.id),
  saleDate: int("sale_date", { mode: "timestamp" }).notNull().$default(() => new Date()),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const invoiceRelations = relations(invoiceTable, ({ one, many }) => ({
  member: one(memberTable, {
    fields: [invoiceTable.memberId],
    references: [memberTable.id],
  }),
  employee: one(employeeTable, {
    fields: [invoiceTable.employeeId],
    references: [employeeTable.id],
  }),
  invoiceLines: many(invoiceLineTable),
}));
