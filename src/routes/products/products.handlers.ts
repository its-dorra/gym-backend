import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { createProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct } from "@/data-access/products";

import type { CreateProductRoute, DeleteProductRoute, GetOneProductRoute, ListRoute, UpdateProductRoute } from "./products.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const products = await getAllProducts();

  return c.json(products);
};

export const getOne: AppRouteHandler<GetOneProductRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const product = await getOneProduct(id);

  if (!product) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(product, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateProductRoute> = async (c) => {
  const product = c.req.valid("json");

  const [inserted] = await createProduct(product);

  return c.json(inserted, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<UpdateProductRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const product = c.req.valid("json");

  const [updatedProduct] = await updateProduct(id, product);

  if (!updateProduct)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.json(updatedProduct, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<DeleteProductRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await deleteProduct(id);

  if (result.rowsAffected === 0)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
