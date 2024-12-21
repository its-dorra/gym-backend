import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { memberTable } from "./member.schema";

export const attendanceTable = sqliteTable("attendance", {
  id: int("id").primaryKey({ autoIncrement: true }),
  memberId: int("member_id").notNull().references(() => memberTable.id),
  checkInTime: int("check_in_time", { mode: "timestamp" }).notNull(),
  checkOutTime: int("check_out_time", { mode: "timestamp" }),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  member: one(memberTable, {
    fields: [attendanceTable.memberId],
    references: [memberTable.id],
  }),
}));

export const insertAttendanceSchema = createInsertSchema(attendanceTable).omit({ id: true, deletedAt: true, createdAt: true, updatedAt: true, checkOutTime: true });

export type InsertedAttendance = z.infer<typeof insertAttendanceSchema>;
