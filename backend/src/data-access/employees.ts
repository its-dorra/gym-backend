import { count, eq } from "drizzle-orm";

import type { EmployeeId, QueryParams, UserId } from "@/lib/types";

import { db } from "@/db";
import { type Employee, employeeTable } from "@/db/schemas/employee.schema";

export async function getEmployees({ page, pageSize }: QueryParams) {
  const offset = (page - 1) * pageSize;

  const [data, { totalCount }] = await Promise.all([
    db.query.employeeTable.findMany({
      limit: pageSize,
      offset,
    }),
    db.select({ totalCount: count() }).from(employeeTable).then(res => res[0]),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { currentPage: page, totalCount, data , totalPages };
}

export function getOneEmployeeByUserId(userId: UserId) {
  return db.query.employeeTable.findFirst({ where: eq(employeeTable.userId, userId) });
}

export function getOneEmployee(employeeId: EmployeeId) {
  return db.query.employeeTable.findFirst({ where: eq(employeeTable.id, employeeId) });
}

export function createEmployee(userId: UserId, employee: Employee) {
  return db.insert(employeeTable).values({ userId, ...employee });
}

export function updateEmployee(employeeId: EmployeeId, updatedEmployee: Partial<Employee>) {
  return db.update(employeeTable).set(updatedEmployee).where(eq(employeeTable.id, employeeId));
}

export function deleteEmployee(employeeId: EmployeeId) {
  return db.update(employeeTable).set({ deletedAt: new Date() }).where(eq(employeeTable.id, employeeId));
}
