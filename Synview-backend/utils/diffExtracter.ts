import { Octokit } from "npm:@octokit/rest";
const env = Deno.env.toObject();

const GitHubToken = env.GITHUB_TOKEN;
const octokit = new Octokit({
  auth: GitHubToken,
});

export default async function diffExtracter(
  owner: string,
  repo: string,
  ref: string
): Promise<string> {
  const { data: diffs } = await octokit.request(
    `GET /repos/{owner}/{repo}/commits/{ref}`,
    {
      owner: owner,
      repo: repo,
      ref: ref,
      headers: {
        accept: "application/vnd.github.diff",
      },
    }
  );
  return String(diffs);
}
