import { withAccelerate, PrismaClient, Router, oakCors } from "../deps.ts";
import { Session } from "../deps.ts";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { z } from "zod";
type AppState = {
  session: Session;
};
const ProjectRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

ProjectRouter.use(AuthMiddleware);

ProjectRouter.get("/getMyProjects/:id", async (context) => {
  const id = context.params.id;
  console.log(id + " that was the id ")
  try {
    const MyProjects = await prisma.project.findMany({
      where: {
        userProjects: {
          some: {
            UserId: parseInt(id),
            role: "CREATOR",
          },
        },
      },
    });
    context.response.body = MyProjects;
  } catch (e) {
    context.response.body = {
      error: "Error fetching projects",
    };
  }
});

export { ProjectRouter };
