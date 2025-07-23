import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { withAccelerate } from "@prisma/extension-accelerate";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { Router } from "@oak/oak";
import { recentCodeAnalysis, commitAnalysis } from "../AI/geminiHandler.ts";
import diffExtracter from "../utils/diffExtracter.ts";
import { rootLogger } from "../../common/Logger.ts";
type AppState = {
  session: Session;
};

const aiRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

aiRouter.use(AuthMiddleware);

aiRouter
  .post("/projectAiReview/:id", async (context) => {
    const id = context.params.id;
    try {
      const project = await prisma.projects.findUnique({
        where: { project_id: parseInt(id) },
      });
      const commits = await prisma.updates.findMany({
        where: {
          project_id: parseInt(id),
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
        commits.map((commit) => {
          if (!commit?.sha) return "";
          return diffExtracter(
            project?.project_git_name!,
            project?.repo_url!,
            commit.sha
          );
        })
      );

      const response = await recentCodeAnalysis(commitString.join(" "));

      await prisma.projects.update({
        where: {
          project_id: project.project_id,
        },
        data: {
          doc_url: response,
        },
      });

      context.response.status = 201;
      context.response.body = response;
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Error reviewing project: " + error,
      };
    }
  })
  .post("/commitAiReview", async (context) => {
    try {
      const { id } = await context.request.body.json();

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

      const response = await commitAnalysis(commitString);

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
  });

export { aiRouter };
