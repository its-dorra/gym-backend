import { createRouter } from "@/lib/create-app";
import { isAdmin } from "@/middlewares/is-admin";
import { isAuthenticated } from "@/middlewares/is-authenticated";

import * as handlers from "./employees.handlers";
import * as routes from "./employees.routes";

const router = createRouter();

router.use(isAuthenticated).use(isAdmin);

router
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;
