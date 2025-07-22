import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { withAccelerate } from "@prisma/extension-accelerate";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { Router } from "@oak/oak";
import { GithubInfoSchema } from "../../common/schemas.ts";
import { Octokit } from "npm:@octokit/rest";
import diffExtracter from "../utils/GITHelpers.ts";
const env = Deno.env.toObject();
type AppState = {
  session: Session;
};
const GitHubToken = env.GITHUB_TOKEN;
const octokit = new Octokit({
  auth: GitHubToken,
});
const githubRouter = new Router<AppState>();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Deno.env.get("DATABASE_URL")!,
    },
  },
}).$extends(withAccelerate());

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
        data: {
          repo_url: githubInfo.repo_name,
          project_git_name: githubInfo.github_user,
        },
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
  .get("/getCommitData", async (context) => {
    try {
      const url = context.request.url;
      const github_user = url.searchParams.get("user");
      const repo_name = url.searchParams.get("repo");
      const commit_sha = url.searchParams.get("sha");
      if (!github_user || !repo_name || !commit_sha) {
        throw new Error("Didnt find url info");
      }
      const response = await octokit.rest.repos.getCommit({
        owner: github_user,
        repo: repo_name,
        ref: commit_sha,
      });

      const diffs = await diffExtracter(github_user, repo_name, commit_sha);

      const commitFiles = response.data.files;
      if (commitFiles) {
        const files = await Promise.all(
          commitFiles.map(async (commitFile) => {
            return await octokit.repos.getContent({
              owner: github_user,
              repo: repo_name,
              path: commitFile.filename,
              sha: commitFile.sha,
            });
          })
        );
        const decodedFiles = files.map((file) => {
          return { name: file.data.name, content: atob(file.data.content) };
        });
        context.response.body = { files: decodedFiles, diffs: diffs };
      } else {
        context.response.status = 404;
        context.response.body = {
          error: "No files found on commit",
        };
      }
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Error geting commits data: " + error,
      };
    }
  });

export { githubRouter };
