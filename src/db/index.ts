import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import schema from "./schemas";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });
