import { defineConfig } from "drizzle-kit";

import env from "@/env";

export default defineConfig({
  dialect: "sqlite",
  schema: "./backend/src/db/schemas/*.ts",
  out: "./backend/src/db/migrations",
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
