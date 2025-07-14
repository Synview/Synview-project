import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { withAccelerate } from "@prisma/extension-accelerate";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { Router } from "@oak/oak";

type AppState = {
  session: Session;
};
import { PostProjectSchema } from "../../common/schemas.ts";
import {
  broadcastPresence,
  sendtoChannel,
} from "../websocket/websocket_server.ts";
const projectRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

projectRouter.use(AuthMiddleware);

projectRouter
  .get("/getProject/:id", async (context) => {
    const id = context.params.id;
    try {
      const Project = await prisma.projects.findUnique({
        where: {
          project_id: parseInt(id),
        },
      });
      broadcastPresence(`Presence:${id}`);
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
      const MyProjects = await prisma.projects.findMany({
        where: {
          user_projects: {
            some: {
              user_id: parseInt(id),
              role: "CREATOR",
            },
          },
        },
      });
      context.response.body = MyProjects;
    } catch (e) {
      context.response.status = 500;
      context.response.body = {
        error: "Error fetching created projects" + e,
      };
    }
  })
  .get("/reviewingProjects/:id", async (context) => {
    const id = context.params.id;
    try {
      const MyReviewingProjects = await prisma.projects.findMany({
        where: {
          user_projects: {
            some: {
              user_id: parseInt(id),
              role: "REVIEWER",
            },
          },
        },
      });
      context.response.body = MyReviewingProjects;
    } catch (e) {
      context.response.status = 500;
      context.response.body = {
        error: "Error fetching ReviewingProjects" + e,
      };
    }
  })
  .post("/postProject", async (context) => {
    try {
      const Project = PostProjectSchema.parse(
        await context.request.body.json()
      );
      const newProject = await prisma.projects.create({
        data: Project,
      });

      await prisma.user_projects.create({
        data: {
          project_id: newProject.project_id,
          user_id: newProject.owner_id,
          role: "CREATOR",
        },
      });
      context.response.status = 201;
      context.response.body = {
        message: "New project created!",
      };
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Error creating project: " + error,
      };
    }
  })
  .get("/getMentors/:id", async (context) => {
    const id = context.params.id;
    try {
      const mentors = await prisma.users.findMany({
        select: {
          user_id: true,
          username: true,
          email: true,
        },
        where: {
          projects: {
            some: {
              project_id: parseInt(id),
              role: "REVIEWER",
            },
          },
        },
      });
      context.response.body = mentors;
    } catch (e) {
      context.response.status = 500;
      context.response.body = {
        error: "Error fetching mentors" + e,
      };
    }
  });

export { projectRouter };
