import { eq } from "drizzle-orm";

import type { User } from "@/db/schemas/user.schema";
import type { UserId } from "@/lib/types";

import { db } from "@/db";
import { userTable } from "@/db/schemas/user.schema";

export function getUser(id: UserId) {
  return db.query.userTable.findFirst({ where(fields, operators) {
    return operators.eq(fields.id, id);
  } });
}

export function getUserByUsername(username: string) {
  return db.query.userTable.findFirst({ where(fields, operators) {
    return operators.eq(fields.username, username);
  } });
}

export function createUser(user: User) {
  return db.insert(userTable).values(user).returning();
}

export async function verifyPassword(username: string, plainPassword: string, hashedPassword: string) {
  return Bun.password.verify(plainPassword, hashedPassword);
}

export function updateUser(userId: UserId, updatedUser: Partial<User>) {
  return db.update(userTable).set(updatedUser).where(eq(userTable.id, userId)).returning();
}
