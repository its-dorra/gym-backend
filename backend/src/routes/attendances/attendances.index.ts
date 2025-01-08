import { createRouter } from "@/lib/create-app";
import { isAuthenticated } from "@/middlewares/is-authenticated";

import * as handlers from "./attendances.handlers";
import * as routes from "./attendances.routes";

const router = createRouter();

router.use(isAuthenticated);

router.openapi(routes.list, handlers.list).openapi(routes.create, handlers.create);

export default router;
