import { GoogleGenAI } from "@google/genai";
import { createLogger, LogLevel } from "../../common/Logger.ts";
import diffExtracter, {
  DirectorySearch,
  FileSearch,
  GetMetadata,
} from "../utils/GITHelpers.ts";
import { rootLogger } from "../../common/Logger.ts";
const googleKey = Deno.env.get("GEMINI_API_KEY");
if (!googleKey) {
  rootLogger.error(
    "Environment variable GEMINI_API_KEY is required but not defined."
  );
  throw new Error(
    "Environment variable GEMINI_API_KEY is required but not defined."
  );
}
const ai = new GoogleGenAI({ apiKey: googleKey });

const logger = createLogger("AI [API]", LogLevel.INFO);

export async function recentCodeAnalysis(
  projectGitName: string,
  projectRepoName: string,
  code: string
) {
  let finalResponse = "";
  const systemPrompt = `
  You are an expert software review agent with autonomous reasoning.

Your job is to analyze commit messages and code diffs, and produce a helpful, clear summary for both developers and non-technical stakeholders.

You have access to these tools. **Use only ONE per message**, formatted **exactly** as shown:

- TOOL:DirectorySearch
- TOOL:FileSearch <filepath>
- TOOL:GetMetadata <commitSha>
- TOOL:CommitExplainer <commitSha>
- FINAL:<your completed review>

### Rules (you must follow these strictly):

1. Only respond with ONE tool call or the FINAL review per message.
2. DO NOT ask questions or give explanations outside tool usage.
3. DO NOT repeat tool calls in the same message or combine multiple tool calls.
4. You must use each tool **at least once** before responding with FINAL.
5. If tool output fails, ignore the error or blank and move on.
6. Final review must begin with Summary: — that’s the only place where full natural language is allowed.
7. Final review will have 2 sections, 1st: For non technical people labeled as : "Non-Technical summary" and 2nd one, labeled as: "Technical summary"

### Important: 
You **must** include the insight from the initial code given in your FINAL review, NO tool results, remember to follow the instructions one by one.
 `;
  const AIchat = ai.chats.create({
    model: "gemini-2.5-pro",
    history: [
      {
        role: "user",
        parts: [{ text: code }],
      },
    ],
    config: {
      systemInstruction: systemPrompt,
    },
  });

  let isRunning = true;
  let iteration = 0;

  while (isRunning && iteration < 10) {
    iteration++;
    const response = await AIchat.sendMessage({
      message: "Start",
    });

    const text = response.text.trim();
    logger.info(`Iteration:  ${iteration}`);

    if (text.startsWith("TOOL:DirectorySearch")) {
      const tool = text.replace("TOOL:DirectorySearch", "").trim();
      logger.info(`Tool request Directory search:${tool}`);

      const toolResult = await DirectorySearch(projectGitName, projectRepoName);
      logger.info(`Result : ${toolResult}`);

      await AIchat.sendMessage({ message: toolResult });
    } else if (text.startsWith("TOOL:FileSearch")) {
      const tool = text.replace("TOOL:FileSearch", "").trim();
      logger.info(`Tool request FileSearch:${tool}`);

      const toolResult = await FileSearch(
        projectGitName,
        projectRepoName,
        tool
      );
      logger.info(`Result : ${toolResult}`);

      await AIchat.sendMessage({ message: toolResult });
    } else if (text.startsWith("TOOL:GetMetadata")) {
      const tool = text.replace("TOOL:GetMetadata", "").trim();
      logger.info(`Tool request Metadata :${tool}`);

      const toolResult = await GetMetadata(
        projectGitName,
        projectRepoName,
        tool
      );
      logger.info(`Result : ${toolResult}`);
      await AIchat.sendMessage({ message: toolResult });
    } else if (text.startsWith("TOOL:CommitExplainer")) {
      const tool = text.replace("TOOL:CommitExplainer", "").trim();
      logger.info(`Tool request CommitExplainer :${tool}`);

      const toolResult = await CommitExplainer(
        projectGitName,
        projectRepoName,
        tool
      );
      logger.info(`Result : ${toolResult}`);

      await AIchat.sendMessage({ message: toolResult });
    } else {
      logger.info(`Ai final answer :${text}`);
      finalResponse = text;
      isRunning = false;
    }
  }

  return finalResponse;
}

async function CommitExplainer(
  owner: string,
  repo: string,
  sha: string
): Promise<string> {
  const systemPrompt = `
  You are an expert software reviewer trained in all programming languages and development best practices. 
  You will be given code diff. 
  Your task is to produce a concise, clear, and insightful review to another LLM
  `;

  const code = await diffExtracter(owner, repo, sha);
  if (code) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: code,
      config: {
        systemInstruction: systemPrompt,
      },
    });
    return response.text;
  }
  return "Error finding commit";
}
