import { createRouter } from "@/lib/create-app";
import { isAuthenticated } from "@/middlewares/is-authenticated";

import * as handlers from "./membership-plans.handlers";
import * as routes from "./membership-plans.routes";

const router = createRouter();

router.use(isAuthenticated);

router.openapi(routes.list, handlers.list).openapi(routes.getOne, handlers.getOne).openapi(routes.create, handlers.create);

export default router;
