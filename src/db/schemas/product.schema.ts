import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { invoiceLineTable } from "./invoice-line.schema";

export const productTable = sqliteTable("product", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  stockQuantity: int("stock_quantity").notNull(),
  category: text("category"),
});

export const productRelations = relations(productTable, ({ many }) => ({
  invoiceLine: many(invoiceLineTable),
}));
