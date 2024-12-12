import { eq } from "drizzle-orm";

import type { Product } from "@/db/schemas/product.schema";
import type { ProductId } from "@/lib/types";

import { db } from "@/db";
import { productTable } from "@/db/schemas/product.schema";

export function getAllProducts(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return db.query.productTable.findMany({
    limit: pageSize,
    offset,
  });
}

export function getOneProduct(productId: ProductId) {
  return db.query.productTable.findFirst({ where: eq(productTable.id, productId) });
}

export function createProduct(product: Product) {
  return db.insert(productTable).values(product).returning().then(res => res?.[0]);
}

export function updateProduct(productId: number, updatedProduct: Partial<Product>) {
  return db.update(productTable).set(updatedProduct).where(eq(productTable.id, productId)).returning().then(res => res?.[0]);
}

export function deleteProduct(productId: number) {
  return db.delete(productTable).where(eq(productTable.id, productId));
}
