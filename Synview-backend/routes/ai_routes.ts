import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { withAccelerate } from "@prisma/extension-accelerate";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { Router } from "@oak/oak";
import { recentCodeAnalysis, commitExplainer } from "../AI/geminiHandler.ts";
import diffExtracter from "../utils/GITHelpers.ts";
import { createLogger, LogLevel, rootLogger } from "../../common/Logger.ts";
type AppState = {
  session: Session;
};

const kv = await Deno.openKv();

const logger = createLogger("AI [API]", LogLevel.INFO);

const aiRouter = new Router<AppState>();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Deno.env.get("DATABASE_URL")!,
    },
  },
}).$extends(withAccelerate());

aiRouter.use(AuthMiddleware);

aiRouter
  .post("/projectAiReview/:id", async (context) => {
    const id = context.params.id;
    const aiJobId = crypto.randomUUID();
    logger.info("Starting review with KV jobs");
    try {
      const project = await prisma.projects.findUnique({
        where: { project_id: parseInt(id) },
      });
      const commits = await prisma.updates.findMany({
        where: {
          project_id: parseInt(id),
          sha: {
            not: null,
          },
        },
        orderBy: {
          created_at: "desc",
        },
        take: 10,
      });

      if (!project?.project_git_name) {
        rootLogger.error("Missing project_git_name");
        context.response.status = 400;
        context.response.body = { error: "Missing project_git_name" };
        return;
      }
      if (!project?.repo_url) {
        rootLogger.error("Missing repo url ");
        context.response.status = 400;
        context.response.body = { error: "Missing repo_url" };
        return;
      }

      const commitString = await Promise.all(
        commits.map(async (commit) => {
          if (!commit?.sha) return "";
          const diff = await diffExtracter(
            project?.project_git_name!,
            project?.repo_url!,
            commit.sha
          );
          return `Commit SHA : ${commit.sha} \n Commit diff start - ${diff} - Commit diff end`;
        })
      );

      await kv.set(["jobs", aiJobId], {
        status: "started",
        response: "",
        project_id: project.project_id,
      });

      const result = await kv.enqueue({
        type: "projectAnalysis",
        aiJobId,
        project_id: project.project_id,
        commits: commitString,
        project_repo_url: project.repo_url,
        project_git_name: project.project_git_name,
      });
      if (result.ok) {
        logger.info(`enqueue for job ${aiJobId} sent`);
      } else {
        logger.error(`Enqueue failed for ${aiJobId}`);
        await kv.set(
          ["jobs", aiJobId],
          {
            status: "failed",
            response: "failed",
            project_id: project.project_id,
          },
          { expireIn: 1000 * 60 * 60 * 24 }
        );
        context.response.status = 500;
        context.response.body = {
          aiJobId,
          status: "failed",
        };
        return;
      }
      context.response.status = 202;
      context.response.body = {
        aiJobId,
        status: "Started",
      };
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Error reviewing project: " + error,
      };
    }
  })
  .post("/commitAiReview/:id", async (context) => {
    try {
      const id = context.params.id;

      const commit = await prisma.updates.findUnique({
        where: { update_id: parseInt(id) },
      });

      const project = await prisma.projects.findUnique({
        where: { project_id: commit?.project_id },
      });
      if (!commit?.sha) {
        rootLogger.warn("No commit sha registered");
        context.response.status = 400;
        context.response.body = {
          error: "Missing commit SHA. Please provide a valid commit ID.",
        };
        return;
      }
      const commitString = await diffExtracter(
        project?.project_git_name!,
        project?.repo_url!,
        commit?.sha
      );

      const response = await commitExplainer(commitString);

      await prisma.updates.update({
        where: { update_id: commit.update_id },
        data: { summary: response },
      });

      context.response.status = 201;
      context.response.body = response;
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Error reviewing commit: " + error,
      };
    }
  })
  .get("/projectAiReview/job/:aiJobId", async (context) => {
    const aiJobId = context.params.aiJobId;

    try {
      const kv = await Deno.openKv();
      const aiJob = await kv.get(["jobs", aiJobId]);
      if (!aiJob.value) {
        context.response.status = 404;
        context.response.body = {
          message: "Job doesnt exist",
        };
        return;
      } else {
        const jobResult = aiJob.value as {
          status: string;
          project_id: number;
          response: string;
        };
        if (jobResult.status === "failed") {
          throw new Error(jobResult.response);
        } else if (jobResult.status === "started") {
          context.response.status = 202;
          context.response.body = {
            message: "job not yet done",
          };
          return;
        }
        await prisma.projects.update({
          where: { project_id: jobResult.project_id },
          data: { ai_summary: jobResult.response },
        });
        context.response.status = 200;
        context.response.body = {
          status: "complete",
          response: jobResult.response,
          project_id: jobResult.project_id,
        };
      }
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: `Error getting aijob response, with error: ${error}`,
      };
    }
  });

export { aiRouter };
