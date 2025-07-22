import { withAccelerate } from "@prisma/extension-accelerate";
import { createLogger, LogLevel, rootLogger } from "../../common/Logger.ts";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Router } from "@oak/oak";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const logger = createLogger("WEBHOOK [API]", LogLevel.INFO);
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

webhookRouter.post("/github/webhook", async (context) => {
  try {
    const payload = context.request.body;
    const text =  JSON.stringify(await payload.json());
    logger.info(text);
    context.response.status = 200;
    context.response.body = {
      message: "Successfull webhook!",
    };
  } catch (error) {
    logger.error(error);
    context.response.status = 500;
    context.response.body = {
      message: "Unsuccessfull webhook!",
    };
  }
});

export { webhookRouter };
