import { Router } from "@oak/oak";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { PostQuestionSchema } from "../../common/schemas.ts";
type AppState = {
  session: Session;
};
const questionRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

questionRouter.use(AuthMiddleware);

questionRouter
  .get("/getUpdateQuestions/:id", async (context) => {
    const id = context.params.id;
    try {
      const myQuestions = await prisma.questions.findMany({
        where: {
          update_id: parseInt(id),
        },
      });
      context.response.body = myQuestions;
    } catch (e) {
      context.response.body = {
        error: "Error fetching questions" + e,
      };
    }
  })
  .post("/postQuestion", async (context) => {
    try {
      const newUpdate = PostQuestionSchema.parse(
        await context.request.body.json()
      );
      await prisma.questions.create({
        data: newUpdate,
      });
      context.response.status = 201;
      context.response.body = {
        message: "New question created!",
      };
    } catch (error) {
      context.response.body = {
        error: "Error creating update: " + error,
      };
    }
  });

export { questionRouter };
