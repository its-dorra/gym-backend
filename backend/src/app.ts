import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import attendances from "@/routes/attendances/attendances.index";
import auth from "@/routes/auth/auth.index";
import employees from "@/routes/employees/employees.index";
import members from "@/routes/members/members.index";
import membershipPlans from "@/routes/membership-plans/membership-plans.index";
import memberships from "@/routes/memberships/memberships.index";
import products from "@/routes/products/products.index";

const app = createApp();

const routes = [
  { path: "/attendances", handler: attendances },
  { path: "/auth", handler: auth },
  { path: "/employees", handler: employees },
  { path: "/members", handler: members },
  { path: "/memberships", handler: memberships },
  { path: "/membership-plans", handler: membershipPlans },
  { path: "/products", handler: products },
] as const;

configureOpenAPI(app);

routes.forEach(({ path, handler }) => {
  app.route(path, handler);
});

export default app;
