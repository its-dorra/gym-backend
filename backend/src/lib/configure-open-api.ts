import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "@/lib/types";

import packgageJSON from "../../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packgageJSON.version,
      title: "Gym Management system API",
    },
  });

  app.get(
    "/reference",
    apiReference({
      pageTitle: "Gym management system API reference",
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },
    }),
  );
}
