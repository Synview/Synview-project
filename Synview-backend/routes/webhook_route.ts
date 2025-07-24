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
    const body = context.request.body;
    const payload = await body.json();
    const pushedCommits = payload.commits;
    const repoUrl = payload.repository.name;

    const project = await prisma.projects.findFirst({
      where: {
        repo_url: repoUrl,
      },
    });

    if (project) {
      const commitUpdates = pushedCommits.map((commit) => {
        return {
          description: commit.message,
          sha: commit.id,
          created_at: commit.timestamp,
          project_id: project.project_id,
          user_id: project.owner_id,
        };
      });

      await prisma.updates.createMany({
        data: commitUpdates,
        skipDuplicates: true,
      });

      context.response.status = 200;
      context.response.body = {
        message: "Successful sync!",
      };
    } else {
      logger.error("Coulndt find the project");
      throw new Error("Couldnt find the project");
    }
  } catch (error) {
    logger.error(error);
    context.response.status = 500;
    context.response.body = {
      message: "Unsuccessful sync!",
    };
  }
});

export { webhookRouter };
