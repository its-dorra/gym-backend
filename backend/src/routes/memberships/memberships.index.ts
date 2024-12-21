import { createRouter } from "@/lib/create-app";
import { isAuthenticated } from "@/middlewares/is-authenticated";

import * as handlers from "./memberships.handlers";
import * as routes from "./memberships.routes";

const router = createRouter();

router.use(isAuthenticated);

router
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;
