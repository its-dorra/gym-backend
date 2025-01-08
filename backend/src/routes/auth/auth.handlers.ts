import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { getCurrentUser } from "@/auth";
import { getOneEmployeeByUserId } from "@/data-access/employees";
import { getUserByUsername, verifyPassword } from "@/data-access/users";
import { deleteSession, setSession } from "@/lib/session";
import { catchErrorTyped } from "@/lib/utils";

import type { LoginRoute, LogoutRoute, UserRoute } from "./auth.routes";

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { username, password } = c.req.valid("json");

  const [storedUser, getUserError] = await catchErrorTyped(getUserByUsername(username));
  if (getUserError) {
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  if (!storedUser)
    return c.json({ message: "Invalid credentials" }, HttpStatusCodes.UNAUTHORIZED);

  const [isValidUser, verifyError] = await catchErrorTyped(verifyPassword(username, password, storedUser.password));
  if (verifyError) {
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  if (!isValidUser)
    return c.json({ message: "Invalid credentials" }, HttpStatusCodes.UNAUTHORIZED);

  const [, setSessionError] = await catchErrorTyped(setSession(c, storedUser.id));
  if (setSessionError) {
    return c.json({ message: "Invalid credentials" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  if (storedUser.deletedAt) {
    return c.json({ message: "Invalid credentials" }, HttpStatusCodes.UNAUTHORIZED);
  }

  if (storedUser.role === "admin")
    return c.json({ id: storedUser.id, username, role: storedUser.role }, HttpStatusCodes.OK);

  const [storedEmployee, getEmployeeError] = await catchErrorTyped(getOneEmployeeByUserId(storedUser.id));

  if (getEmployeeError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (storedEmployee?.deletedAt)
    return c.json({ message: "Invalid credentials" }, HttpStatusCodes.UNAUTHORIZED);

  return c.json({ id: storedUser.id, username, role: storedUser.role }, HttpStatusCodes.OK);
};

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
  const [, deleteSessionError] = await catchErrorTyped(deleteSession(c));
  if (deleteSessionError) {
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const user: AppRouteHandler<UserRoute> = async (c) => {
  const [authenticatedUser, getCurrentUserError] = await catchErrorTyped(getCurrentUser(c));

  if (getCurrentUserError) {
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  if (!authenticatedUser)
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);

  return c.json(authenticatedUser, HttpStatusCodes.OK);
};
