import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import defaultHook from "stoker/openapi/default-hook";

import type { AppBindings } from "@/lib/types";

import { pinoLogger } from "@/middlewares/pino-logger";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLogger());
  app.use(serveEmojiFavicon("😁"));
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
