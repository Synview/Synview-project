import { PostUpdateSchema } from "../../common/schemas.ts";
import { withAccelerate, PrismaClient, Router } from "../deps.ts";
import { Session } from "../deps.ts";
import AuthMiddleware from "../middleware/auth_middleware.ts";
type AppState = {
  session: Session;
};
const updateRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

updateRouter.use(AuthMiddleware);

updateRouter
  .get("/getMyUpdates/:id", async (context) => {
    const id = context.params.id;
    try {
      const MyUpdates = await prisma.update.findMany({
        where: {
          ProjectId: parseInt(id),
        },
      });
      context.response.body = MyUpdates;
    } catch (e) {
      context.response.body = {
        error: "Error fetching updates" + e,
      };
    }
  })
  .post("/postUpdate", async (context) => {
    try {
      const newUpdate = PostUpdateSchema.parse(
        await context.request.body.json()
      );
      await prisma.update.create({
        data: newUpdate,
      });
    } catch (error) {
      context.response.body = {
        error: "Error creating update: " + error,
      };
    }
  });

export { updateRouter };
