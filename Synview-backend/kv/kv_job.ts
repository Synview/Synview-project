import { createLogger } from "../../common/Logger.ts";
import { recentCodeAnalysis } from "../AI/geminiHandler.ts";

// @ts-check
const kv = await Deno.openKv();
const logger = createLogger("KV_JOB");

type jobMessage = {
  type: string;
  aiJobId: string;
  project_id: number;
  commits: string[];
  project_repo_url: string;
  project_git_name: string;
};

kv.listenQueue(async (msg: jobMessage) => {
  logger.info(`Processing analysis job`);
  if (msg.type !== "projectAnalysis") {
    logger.warn("Incorrect type of message");
    return;
  }

  const { aiJobId, project_id, commits, project_repo_url, project_git_name } =
    msg;
    logger.info(`Job : ${aiJobId} started!`)
  try {
    logger.info("Started code analisis");
    const response = await recentCodeAnalysis(
      project_git_name,
      project_repo_url,
      commits.join(" ")
    );

    logger.info(`finished code analisis with response : ${response}`);
    await kv.set(
      ["jobs", aiJobId],
      {
        status: "complete",
        response: response,
        project_id: project_id,
      },
      { expireIn: 1000 * 60 * 60 * 24 }
    );
    logger.info("finished code analisis");
  } catch (error) {
    logger.error(
      `Couldnt process code analysis in KV job with error : ${error}`
    );
    await kv.set(
      ["jobs", aiJobId],
      {
        status: "failed",
        response: error,
        project_id: 0,
      },
      { expireIn: 1000 * 60 * 60 * 24 }
    );
  }
});
