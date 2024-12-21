import { relations } from "drizzle-orm";
import { int, real, sqliteTable } from "drizzle-orm/sqlite-core";

import { employeeTable } from "./employee.schema";
import { invoiceTable } from "./invoice.schema";
import { memberTable } from "./member.schema";
import { productTable } from "./product.schema";

export const invoiceLineTable = sqliteTable("invoice_line", {
  id: int("id").primaryKey({ autoIncrement: true }),
  productId: int("product_id").notNull().references(() => productTable.id),
  invoiceId: int("invoice_id").notNull().references(() => invoiceTable.id),
  quantity: int("quantity").notNull(),
  totalPrice: real("total_price").notNull(),
  deletedAt : int('deleted_at',{mode : 'timestamp'}),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const invoiceLineRelations = relations(invoiceLineTable, ({ one }) => ({
  invoice: one(invoiceTable, {
    fields: [invoiceLineTable.invoiceId],
    references: [invoiceTable.id],
  }),
  product: one(productTable, {
    fields: [invoiceLineTable.productId],
    references: [productTable.id],
  }),
}));
