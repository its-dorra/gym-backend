import { eq } from "drizzle-orm";

import type { EmployeeId, UserId } from "@/lib/types";

import { db } from "@/db";
import { type Employee, employeeTable } from "@/db/schemas/employee.schema";

export function getEmployees(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;

  return db.query.employeeTable.findMany({
    limit: pageSize,
    offset,
  });
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
  return db.delete(employeeTable).where(eq(employeeTable.id, employeeId));
}
