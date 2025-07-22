import { withAccelerate } from "@prisma/extension-accelerate";
import { createLogger, LogLevel, rootLogger } from "../../common/Logger.ts";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Router } from "@oak/oak";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const logger = createLogger("AI [API]", LogLevel.INFO);
type AppState = {
  session: Session;
};

const webhookRouter = new Router<AppState>();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Deno.env.get("DATABASE_URL")!,
    },
  },
}).$extends(withAccelerate());

webhookRouter.post("/github/webhook", (context) => {
  const payload = context.request.body;
  logger.info(`Recieved : ${payload}`);
});

export { webhookRouter };
