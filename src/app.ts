import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import employees from "@/routes/employees/employees.index";
import memberships from "@/routes/memberships/memberships.index";
import products from "@/routes/products/products.index";

const app = createApp();

const routes = [
  { path: "/auth", handler: auth },
  { path: "/products", handler: products },
  { path: "/employees", handler: employees },
  { path: "/memberships", handler: memberships },
] as const;

configureOpenAPI(app);

routes.forEach(({ path, handler }) => {
  app.route(path, handler);
});

export default app;
