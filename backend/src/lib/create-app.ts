import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import defaultHook from "stoker/openapi/default-hook";

import type { AppBindings } from "@/lib/types";

import { pinoLogger } from "@/middlewares/pino-logger";


export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
  const app = createRouter();

  app.use("*", cors({
    origin: "*",
    credentials: true,
    allowHeaders: ["Content-Type"],
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    maxAge: 600,
  }));

  // app.use("*", configuredSecureHeaders());

  app.use(pinoLogger());
  app.use(serveEmojiFavicon("😁"));
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
