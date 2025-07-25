import { createLogger } from "../../common/Logger.ts";
import { recentCodeAnalysis } from "../AI/geminiHandler.ts";
const kv = await Deno.openKv();
const logger = createLogger("KV_JOB");

logger.info("Starting queue listener")

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
  const { aiJobId, project_id, commits, project_repo_url, project_git_name } =
    msg;

  try {
    if (msg.type !== "projectAnalysis") {
      logger.warn("Incorrect type of message");
      return;
    }

    logger.info(`Job : ${aiJobId} started!`);
    logger.info("Started code analysis");
    const response = await recentCodeAnalysis(
      project_git_name,
      project_repo_url,
      commits.join(" ")
    );

    logger.info(`finished code analysis with response : ${response}`);
    await kv.set(
      ["jobs", aiJobId],
      {
        status: "complete",
        response: response,
        project_id: project_id,
      },
      { expireIn: 1000 * 60 * 60 * 24 }
    );
    logger.info("finished code analysis");
  } catch (error) {
    logger.error(
      `Couldn't process code analysis in KV job with error : ${error}`
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
