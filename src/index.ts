import { serve } from "bun";

import app from "@/app";
import env from "@/env";

const port = env.port;

// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});


