import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { invoiceLineTable } from "./invoice-line.schema";

export const productTable = sqliteTable("product", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  subtitle: text("subtitle"),
  price: real("price").notNull(),
  stockQuantity: int("stock_quantity").notNull(),
  // category: text("category").notNull(),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const productRelations = relations(productTable, ({ many }) => ({
  invoiceLine: many(invoiceLineTable),
}));

export const selectProductSchema = createSelectSchema(productTable);

export const insertProductSchema = createInsertSchema(productTable, {
  stockQuantity: z.number().positive(),
}).omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true });

export const updateProductSchema = insertProductSchema.partial();

export type Product = z.infer<typeof insertProductSchema>;
