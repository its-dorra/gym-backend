import { eq } from "drizzle-orm";

import type { EmployeeId, UserId } from "@/lib/types";

import { db } from "@/db";
import { type Employee, employeeTable } from "@/db/schemas/employee.schema";

export function getEmployees() {
  return db.query.employeeTable.findMany();
}

export function createEmployee(userId: UserId, employee: Employee) {
  return db.insert(employeeTable).values({ userId, ...employee }).returning();
}

export function updateEmployee(employeeId: EmployeeId, updatedEmployee: Partial<Employee>) {
  return db.update(employeeTable).set(updatedEmployee).where(eq(employeeTable.id, employeeId));
}

export function deleteEmployee(employeeId: EmployeeId) {
  return db.delete(employeeTable).where(eq(employeeTable.id, employeeId));
}
