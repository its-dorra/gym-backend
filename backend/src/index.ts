import app from "@/app";
import env from "@/env";
import "@/tasks/cron-tasks";

const port = Number(env.port);

// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);

Bun.serve({
  fetch: app.fetch,
  port,
});
