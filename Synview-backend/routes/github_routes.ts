import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { withAccelerate } from "@prisma/extension-accelerate";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { Router } from "@oak/oak";
import { GithubInfoSchema } from "../../common/schemas.ts";
import { Octokit } from "npm:@octokit/rest";
import { Page } from "https://deno.land/x/mongo@v0.31.2/src/utils/saslprep/memory_pager.ts";
const env = Deno.env.toObject();
type AppState = {
  session: Session;
};
const GitHubToken = env.GITHUB_TOKEN;
const octokit = new Octokit({
  auth: GitHubToken,
});
const githubRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

githubRouter.use(AuthMiddleware);

githubRouter
  .post("/syncCommits", async (context) => {
    try {
      const githubInfo = GithubInfoSchema.parse(
        await context.request.body.json()
      );
      let page = 1;
      const allCommits = [];
      while (true) {
        const response = await octokit.rest.repos.listCommits({
          owner: githubInfo.github_user,
          repo: githubInfo.repo_name,
          per_page: 100,
          page: page,
        });
        allCommits.push(...response.data);
        if (response.data.length < 100) break;
        page++;
      }
      const commitUpdates = allCommits.map((response) => {
        return {
          description: response.commit.message,
          sha: response.sha,
          created_at: response.commit.committer?.date,
          project_id: githubInfo.project_id,
          user_id: githubInfo.user_id,
        };
      });

      await prisma.projects.update({
        where: { project_id: githubInfo.project_id },
        data: { repo_url: githubInfo.repo_name },
      });

      await prisma.updates.createMany({
        data: commitUpdates,
        skipDuplicates: true,
      });

      context.response.status = 201;
      context.response.body = {
        message: "synced commits!",
      };
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Error syncing commits: " + error,
      };
    }
  })
  .get("/getCommit", async (context) => {});

export { githubRouter };
