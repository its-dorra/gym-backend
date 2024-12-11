import { eq } from "drizzle-orm";

import type { Product } from "@/db/schemas/product.schema";

import { db } from "@/db";
import { productTable } from "@/db/schemas/product.schema";

export function getAllProducts() {
  return db.query.productTable.findMany();
}

export function getOneProduct(productId: number) {
  return db.query.productTable.findFirst({ where: (table, { eq }) => eq(table.id, productId) });
}

export function createProduct(product: Product) {
  return db.insert(productTable).values(product).returning();
}

export function updateProduct(productId: number, updatedProduct: Partial<Product>) {
  return db.update(productTable).set(updatedProduct).where(eq(productTable.id, productId)).returning();
}

export function deleteProduct(productId: number) {
  return db.delete(productTable).where(eq(productTable.id, productId));
}
