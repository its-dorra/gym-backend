import cron from "node-cron";

import { toggleExpiredMemberships } from "@/services/membership-service";

cron.schedule("0 7 * * *", async () => {
  await toggleExpiredMemberships();
});
