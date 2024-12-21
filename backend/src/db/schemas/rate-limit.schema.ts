import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rateLimitAttempts = sqliteTable("rate_limit_attempts", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  ip: text("ip").notNull(),
  timestamp: int("timestamp", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  route: text("route").notNull(),
});
