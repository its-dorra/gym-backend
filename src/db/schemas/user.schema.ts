import type { z } from "zod";

import { type InferSelectModel, relations } from "drizzle-orm";
import { index, int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { employeeTable } from "./employee.schema";
import { membershipTable } from "./membership.schema";

export const userTable = sqliteTable("user", {
  id: int("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["employee", "admin"] }).$type<"employee" | "admin">().notNull(),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
}, table => ({
  username_idx: index("username_idx").on(table.username),
}));

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});

export const userRelations = relations(userTable, ({ one, many }) => ({
  employee: one(employeeTable, {
    fields: [userTable.id],
    references: [employeeTable.userId],
  }),
  memberships: many(membershipTable),
}));

export const selectUserSchema = createSelectSchema(userTable).omit({ password: true, createdAt: true, updatedAt: true });

export const insertUserSchema = createInsertSchema(userTable).omit({ createdAt: true, updatedAt: true, id: true });

export type User = z.infer<typeof selectUserSchema>;

export type InsertdUser = z.infer<typeof insertUserSchema>;

export type Session = InferSelectModel<typeof sessionTable>;
