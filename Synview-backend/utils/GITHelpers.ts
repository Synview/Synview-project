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
  try {
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
  } catch {
    return "";
  }
}

export async function GetMetadata(
  owner: string,
  repo: string,
  sha: string
): Promise<string> {
  try {
    const result = await octokit.request(
      `GET /repos/{owner}/{repo}/commits/{ref}`,
      {
        owner: owner,
        repo: repo,
        ref: sha,
      }
    );
    return JSON.stringify(result.data.commit);
  } catch {
    return "";
  }
}
export async function DirectorySearch(
  owner: string,
  repo: string
): Promise<string> {
  try {
    const result = await octokit.request(
      `GET /repos/{owner}/{repo}/contents/`,
      {
        owner: owner,
        repo: repo,
      }
    );
    return JSON.stringify(result.data);
  } catch {
    return "";
  }
}
export async function FileSearch(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  try {
    const result = await octokit.request(
      `GET /repos/{owner}/{repo}/contents/{path}`,
      {
        owner: owner,
        repo: repo,
        path: path,
      }
    );
    return JSON.stringify(result.data);
  } catch {
    return "";
  }
}
