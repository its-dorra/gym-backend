import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { createEmployee, deleteEmployee, getEmployees, getOneEmployee, updateEmployee } from "@/data-access/employee";
import { createUser } from "@/data-access/users";
import { catchErrorTyped, hashPassword } from "@/lib/utils";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./employees.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {

  const {page,pageSize} = c.req.valid('query')

  const [employees, error] = await catchErrorTyped(getEmployees(page,pageSize));

  if (error) {
    return c.json({ message: "Can't fetch employees , please try again" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return c.json(employees, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id: employeeId } = c.req.valid("param");

  const [employee, getEmployeeError] = await catchErrorTyped(getOneEmployee(employeeId));

  if (getEmployeeError)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (!employee)
    return c.json({ message: "Employee not found" }, HttpStatusCodes.NOT_FOUND);

  return c.json(employee, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { username, password, role, ...employee } = c.req.valid("json");

  const [hashedPassword, hashingError] = await catchErrorTyped(hashPassword(password));

  if (hashingError) {
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  const [createdUser, creatingUserError] = await catchErrorTyped(createUser({ username, password: hashedPassword, role }));

  if (creatingUserError)
    return c.json({ message: "Error creating user" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  const [_, creatingEmployeeError] = await catchErrorTyped(createEmployee(createdUser.id, employee));

  if (creatingEmployeeError)
    return c.json({ message: "Error creating employee" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  return c.json({ message: "Employee created successfully" }, HttpStatusCodes.CREATED);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id: employeeId } = c.req.valid("param");
  const employee = c.req.valid("json");

  const [_, updateEmployeeError] = await catchErrorTyped(updateEmployee(employeeId, employee));

  if (updateEmployeeError)
    return c.json({ message: "Error updatting employee" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  return c.json({ message: "Updating employee successfully" }, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id: employeeId } = c.req.valid("param");

  const [result, removeEmployeeErrors] = await catchErrorTyped(deleteEmployee(employeeId));

  if (removeEmployeeErrors)
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  if (result.rowsAffected === 0)
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
