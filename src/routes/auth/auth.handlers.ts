import { json } from "drizzle-orm/mysql-core";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { getCurrentUser } from "@/auth";
import { getUserByUsername, verifyPassword } from "@/data-access/users";

import type { LoginRoute, UserRoute } from "./auth.routes";

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { username, password } = c.req.valid("json");

  const storedUser = await getUserByUsername(username);
  if (!storedUser)
    return c.json({ message: "Invalid credentials" }, HttpStatusCodes.UNAUTHORIZED);

  const isValidUser = await verifyPassword(username, password, storedUser.password);

  if (!isValidUser)
    return c.json({ message: "Invalid credentials" }, HttpStatusCodes.UNAUTHORIZED);

  return c.json({ id: storedUser.id, username, role: storedUser.role }, HttpStatusCodes.OK);
};

export const user: AppRouteHandler<UserRoute> = async (c) => {
  const authenticatedUser = await getCurrentUser(c);

  if (!authenticatedUser)
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);

  return c.json(authenticatedUser, HttpStatusCodes.OK);
};
