import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { withAccelerate } from "@prisma/extension-accelerate";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { Router } from "@oak/oak";

type AppState = {
  session: Session;
};
import { PostProjectSchema } from "../../common/schemas.ts";
const projectRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

projectRouter.use(AuthMiddleware);

projectRouter.get("/getProject/:id", async (context) => {
  const id = context.params.id;
  try {
    const Project = await prisma.project.findUnique({
      where: {
        ProjectId: parseInt(id),
      },
    });
    context.response.body = Project;
  } catch (e) {
    context.response.body = {
      error: `Error fetching project with id ${id}` + e,
    };
  }
})
  .get("/getMyProjects/:id", async (context) => {
    const id = context.params.id;
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
        error: "Error fetching projects" + e,
      };
    }
  })
  .post("/postProject", async (context) => {
    try {
      const Project = PostProjectSchema.parse(
        await context.request.body.json()
      );
      const newProject = await prisma.project.create({
        data: Project,
      });

      await prisma.user_Project.create({
        data: {
          ProjectId: newProject.ProjectId,
          UserId: newProject.owner_id,
          role: "CREATOR",
        },
      });
    } catch (error) {
      context.response.body = {
        error: "Error creating project: " + error,
      };
    }
  });

export { projectRouter };
