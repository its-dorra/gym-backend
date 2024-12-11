import { defineConfig } from "drizzle-kit";

import env from "@/env";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schemas/*.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
