import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { withAccelerate } from "@prisma/extension-accelerate";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { Router } from "@oak/oak";
import { GithubInfoSchema } from "../../common/schemas.ts";
import { Octokit } from "npm:@octokit/rest";
import { Page } from "https://deno.land/x/mongo@v0.31.2/src/utils/saslprep/memory_pager.ts";

type AppState = {
  session: Session;
};
const octokit = new Octokit();
const githubRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

githubRouter.use(AuthMiddleware);

githubRouter
  .post("/suncCommitsHook" , async(context)=> {

  })
  .post("/syncCommits", async (context) => {
    try {
      const GithubInfo = GithubInfoSchema.parse(
        await context.request.body.json()
      );
      let page = 1;
      const allCommits = [];
      while (true) {
        const response = await octokit.rest.repos.listCommits({
          owner: GithubInfo.github_user,
          repo: GithubInfo.repo_name,
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
          project_id: GithubInfo.project_id,
          user_id: GithubInfo.user_id,
        };
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
