import { GoogleGenAI } from "@google/genai";
import { createLogger, LogLevel } from "../../common/Logger.ts";
import diffExtracter, {
  DirectorySearch,
  FileSearch,
  GetMetadata,
} from "../utils/GITHelpers.ts";
import { AiToolMessageSchema } from "../../common/schemas.ts";
import { rootLogger } from "../../common/Logger.ts";
import { parse } from "node:path";
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

const MAX_ITERATIONS = 4;

export async function recentCodeAnalysis(
  projectGitName: string,
  projectRepoName: string,
  code: string
) {
  let finalResponse = "";
  const systemPrompt = `
You are an expert software review agent.
Your job is to mainly analyze the comits given to you in the first message and other code diffs you can explore, then summarize them for both developers and non-technical stakeholders.
Only the FINAL response may include natural language and should be clearly formatted with headers.

You can use these tools:

DirectorySearch

FileSearch <filepath>

GetMetadata <commitSha>

CommitExplainer <commitSha>

FINAL <your-completed-review>

Use only ONE tool per message. Format responses exactly like this, with nothing else:

{
"tool": "<ToolName>",
"value": "<ValueHere>"
}

Example of FINAL:

{
"tool": "FINAL",
"value": "Summary: ..."
}

Rules you must follow:

One tool per message only.

No explanations, reasoning, or markdown outside of FINAL.

Do not combine or repeat tool calls.

Use each tool at least once before FINAL.

If a tool result fails or is empty, continue anyway.

FINAL must begin with "Summary:" and contain two parts:

"Non-Technical summary"

"Technical summary"

You must respond with FINAL within 6 iterations.

FINAL must reflect your own insight from the original code — do not copy tool output.
FINAL must have markdown style
You only have 3 iterations to get what you want, 4th needs to be "FINAL"
`;

  const AIchat = ai.chats.create({
    model: "gemini-2.5-flash",
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

  while (isRunning && iteration < MAX_ITERATIONS) {
    iteration++;
    const response = await AIchat.sendMessage({
      message: "Start",
    });
    let parsedResponse;
    try {
      logger.info(response.text.trim());
      try {
        parsedResponse = JSON.parse(response.text.trim());
      } catch (jsonError) {
        logger.error(`JSON parsing failed: ${jsonError.message}`);
        await AIchat.sendMessage({
          message: `NOT A VALID RESPONSE RETURN WITH THIS FORMAT {
  "tool" : "<toolSelected>",
  "value": "<valueSelected>" 
}`,
        });
        continue;
      }
      let text; 
      try {
        text = AiToolMessageSchema.parse(parsedResponse);

      }catch(schemaError){
         logger.error(`Schema validation failed: ${schemaError.message}`);
        await AIchat.sendMessage({
          message: `NOT A VALID RESPONSE RETURN WITH THIS FORMAT {
  "tool" : "<toolSelected>",
  "value": "<valueSelected>" 
}`,
        });
        continue;
      }
      logger.info(`Iteration:  ${iteration}`);

      if (text["tool"] === "DirectorySearch") {
        logger.info(`Tool request Directory search:`);
        const toolResult = await DirectorySearch(
          projectGitName,
          projectRepoName
        );
        logger.info(`Result : ${toolResult}`);
        await AIchat.sendMessage({ message: toolResult });
      } else if (text["tool"] === "FileSearch") {
        const search = text["value"];
        logger.info(`Tool request FileSearch:${search}`);

        const toolResult = await FileSearch(
          projectGitName,
          projectRepoName,
          search
        );
        logger.info(`Result : ${toolResult}`);

        await AIchat.sendMessage({ message: toolResult });
      } else if (text["tool"] === "GetMetadata") {
        const search = text["value"];
        logger.info(`Tool request Metadata :${search}`);

        const toolResult = await GetMetadata(
          projectGitName,
          projectRepoName,
          search
        );
        logger.info(`Result : ${toolResult}`);
        await AIchat.sendMessage({ message: toolResult });
      } else if (text["tool"] === "CommitExplainer") {
        const search = text["value"];
        logger.info(`Tool request CommitExplainer :${search}`);

        const code = await diffExtracter(
          projectGitName,
          projectRepoName,
          search
        );

        const toolResult = await commitExplainer(code);
        logger.info(`Result : ${toolResult}`);

        await AIchat.sendMessage({ message: toolResult });
      } else if (text["tool"] === "FINAL") {
        logger.info(`Ai final answer :${text.value}`);
        finalResponse = text.value;
        isRunning = false;
      } else {
        logger.error("Tool requested non existing :", text);
        await AIchat.sendMessage({ message: "NOT A VALID RESPONSE" });
      }
    } catch (error) {
      logger.error(`Ai returned an invalid response : ${error}`);
      await AIchat.sendMessage({
        message: `NOT A VALID RESPONSE RETURN WITH THIS FORMAT {
  "tool" : "<toolSelected>",
  "value": "<valueSelected>" 
}`,
      });
    }
  }
  return finalResponse;
}

export async function commitExplainer(code: string): Promise<string> {
  const systemPrompt = `
  You are an expert software reviewer trained in all programming languages and development best practices. 
  You will be given code diff. 
  Your task is to produce a concise, clear, and insightful review with markdown format
  `;
  if (code) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: code,
      config: {
        systemInstruction: systemPrompt,
      },
    });
    return response.text;
  }
  return "Error finding commit, please try again";
}
