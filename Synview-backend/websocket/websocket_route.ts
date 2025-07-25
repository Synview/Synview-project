import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { withAccelerate } from "@prisma/extension-accelerate";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { Router } from "@oak/oak";
import { EntrySocket } from "./websocket_server.ts";

type AppState = {
  session: Session;
};

const wsRouter = new Router<AppState>();


wsRouter.get("/ws", async (context) => {
  if (!context.isUpgradable) {
    context.response.status = 501;
    context.response.body = {
      error: "Connection should be for a web socket",
    };
  }
  const ws = context.upgrade();
  EntrySocket(ws);
});

export { wsRouter };
