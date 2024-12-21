import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { createProduct, deleteProduct, getOneProduct, getProducts, updateProduct } from "@/data-access/products";
import { catchErrorTyped } from "@/lib/utils";

import type { CreateProductRoute, DeleteProductRoute, GetOneProductRoute, ListRoute, UpdateProductRoute } from "./products.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page, pageSize } = c.req.valid("query");

  const [result, error] = await catchErrorTyped(getProducts({ page, pageSize }));

  if (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json(result, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneProductRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const [product, error] = await catchErrorTyped(getOneProduct(id));

  if (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  if (!product) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(product, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateProductRoute> = async (c) => {
  const product = c.req.valid("json");

  const [inserted, error] = await catchErrorTyped(createProduct(product));

  if (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const patch: AppRouteHandler<UpdateProductRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const product = c.req.valid("json");

  const [updatedProduct, error] = await catchErrorTyped(updateProduct(id, product));

  if (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  if (!updatedProduct) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedProduct, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<DeleteProductRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const [result, error] = await catchErrorTyped(deleteProduct(id));

  if (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  if (result.rowsAffected === 0) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
