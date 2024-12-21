import { count, eq, isNull } from "drizzle-orm";

import type { Product } from "@/db/schemas/product.schema";
import type { ProductId, QueryParams } from "@/lib/types";

import { db } from "@/db";
import { productTable } from "@/db/schemas/product.schema";

export async function getProducts({ page, pageSize }: QueryParams) {
  const offset = (page - 1) * pageSize;
  const [data, { totalCount }] = await Promise.all([
    db.query.productTable.findMany({
      where: isNull(productTable.deletedAt),
      limit: pageSize,
      offset,
    }),
    db.select({ totalCount: count() }).from(productTable).where(isNull(productTable.deletedAt)).then(res => res[0]),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { currentPage: page, totalCount, data, totalPages };
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
  return db.update(productTable).set({ deletedAt: new Date() }).where(eq(productTable.id, productId));
}
