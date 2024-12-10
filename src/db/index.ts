import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "@/env";

import schema from "./schemas";

const client = createClient({ url: env.DB_FILE_NAME! });
export const db = drizzle({ client, schema });
