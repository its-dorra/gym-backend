import type { ZodError } from "zod";

import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  port: z.string().default('9999'),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
  DB_FILE_NAME: z.string().url(),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports, ts/no-redeclare
let env: env;

try {
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.error("❌ invalid error");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
