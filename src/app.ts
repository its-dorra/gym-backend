import employees from "@/routes/employees/employees.index";

import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import products from "@/routes/products/products.index";

const app = createApp();

const routes = [
  auth,
  products,
  employees,
] as const;

configureOpenAPI(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
