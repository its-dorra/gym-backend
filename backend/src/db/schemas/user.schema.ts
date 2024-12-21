import { type InferSelectModel, relations } from "drizzle-orm";
import { index, int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { employeeTable } from "./employee.schema";
import { memberTable } from "./member.schema";
import { membershipTable } from "./membership.schema";

export const userTable = sqliteTable("user", {
  id: int("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["employee", "admin"] }).$type<"employee" | "admin">().notNull(),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
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
  members: many(memberTable),
}));

export const selectUserSchema = createSelectSchema(userTable).omit({ password: true, createdAt: true, updatedAt: true, deletedAt: true });

export const insertUserSchema = createInsertSchema(userTable, {
  password: z.string().min(8, "Password must be at least 8 characters long"),
}).omit({ createdAt: true, updatedAt: true, id: true, deletedAt: true });

export type User = z.infer<typeof selectUserSchema>;

export type InsertdUser = z.infer<typeof insertUserSchema>;

export type Session = InferSelectModel<typeof sessionTable>;
