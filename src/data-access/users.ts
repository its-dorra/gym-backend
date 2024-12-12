import { eq } from "drizzle-orm";

import type { InsertdUser, User } from "@/db/schemas/user.schema";
import type { UserId } from "@/lib/types";

import { db } from "@/db";
import { userTable } from "@/db/schemas/user.schema";

export function getUser(userId: UserId) {
  return db.query.userTable.findFirst({ where: eq(userTable.id, userId),
  });
}

export function getUserByUsername(username: string) {
  return db.query.userTable.findFirst({ where: eq(userTable.username, username) });
}

export function createUser(user: InsertdUser) {
  return db.insert(userTable).values(user).returning().then(res => res[0]);
}

export async function verifyPassword(username: string, plainPassword: string, hashedPassword: string) {
  return Bun.password.verify(plainPassword, hashedPassword);
}

export function updateUser(userId: UserId, updatedUser: Partial<InsertdUser>) {
  return db.update(userTable).set(updatedUser).where(eq(userTable.id, userId)).returning().then(res => res?.[0]);
}
