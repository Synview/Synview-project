import { PostUpdateSchema } from "../../common/schemas.ts";
import { Router } from "@oak/oak";

import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import {
  sendToChannel,
} from "../websocket/websocket_server.ts";
type AppState = {
  session: Session;
};
const updateRouter = new Router<AppState>();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Deno.env.get("DATABASE_URL")!,
    },
  },
}).$extends(withAccelerate());

updateRouter.use(AuthMiddleware);

updateRouter
  .get("/getMyUpdates/:id", async (context) => {
    const id = context.params.id;
    try {
      const MyUpdates = await prisma.updates.findMany({
        where: {
          project_id: parseInt(id),
        },
      });

      context.response.body = MyUpdates;
    } catch (e) {
      context.response.body = {
        error: `Error fetching updates: ${e}`,
      };
    }
  })
  .get("/getUpdateById/:id", async (context) => {
    const id = context.params.id;
    try {
      const update = await prisma.updates.findUnique({
        where: {
          update_id: parseInt(id),
        },
      });
      context.response.body = update;
    } catch (e) {
      context.response.status = 402;
      context.response.body = {
        error: `Error fetching update: ${e}`,
      };
    }
  })
  .post("/postUpdate", async (context) => {
    try {
      const newUpdate = PostUpdateSchema.parse(
        await context.request.body.json()
      );
      const result = await prisma.updates.create({
        data: newUpdate,
      });

      sendToChannel(`Updates:${newUpdate.project_id}`, newUpdate);

      context.response.status = 201;
      context.response.body = {
        message: "New update created!",
      };
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: `Error creating update: ${error}`,
      };
    }
  });

export { updateRouter };
