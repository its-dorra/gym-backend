import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { memberTable } from "./member.schema";

export const attendanceTable = sqliteTable("attendance", {
  id: int("id").primaryKey({ autoIncrement: true }),
  memberId: int("member_id").notNull().references(() => memberTable.id),
  checkInTime: text("check_in_time").notNull(),
  checkOutTime: text("check_out_time"),
  createdAt: int("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
});

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  member: one(memberTable, {
    fields: [attendanceTable.memberId],
    references: [memberTable.id],
  }),
}));
