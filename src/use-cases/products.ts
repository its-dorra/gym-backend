import type { Context } from "hono";

import * as HttpStatysCodes from "stoker/http-status-codes";

import type { Product } from "@/db/schemas/product.schema";

import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "@/data-access/products";

export function getProductsUseCase() {
  return getProducts();
}

export async function getProductByIdUseCase(c: Context, productId: number) {
  const product = await getProductById(productId);
  if (!product) {
    c.status(HttpStatysCodes.NOT_FOUND);
    throw new Error("Product not found");
  }

  return product;
}

export async function createProductUseCase(product: Product) {
  return createProduct(product);
}

export async function updateProductUseCase(c: Context, productId: number, updatedProduct: Partial<Product>) {
  const [product] = await updateProduct(productId, updatedProduct);

  if (!product) {
    c.status(HttpStatysCodes.NOT_FOUND);
    throw new Error("Product not found");
  }
  return product;
}

export async function deleteProductUseCase(c: Context, productId: number) {
  const [product] = await deleteProduct(productId);

  if (!product) {
    c.status(HttpStatysCodes.NOT_FOUND);
    throw new Error("Product not found");
  }

  return product;
}
