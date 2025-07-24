import { GoogleGenAI } from "@google/genai";
import { createLogger, LogLevel } from "../../common/Logger.ts";
import diffExtracter, {
  DirectorySearch,
  FileSearch,
  GetMetadata,
} from "../utils/GITHelpers.ts";
import { AiToolMessageSchema } from "../../common/schemas.ts";
const googleKey = Deno.env.get("GEMINI_API_KEY");
const ai = new GoogleGenAI({ apiKey: googleKey });

const logger = createLogger("AI [API]", LogLevel.INFO);

const MAX_ITERATIONS = 10;

export async function recentCodeAnalisis(
  projectGitName: string,
  projectRepoName: string,
  code: string
) {
  const toolCalls = new Map<string, string>();

  try {
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
"value": "Summary: ..." **MARKDOWN HERE**
}

Rules you must follow:

One tool per message only.

Your response must always be valid JSON, you should escape new lines with \\n , also remember to escape strings , etc. 

No explanations, reasoning, or markdown outside of FINAL.

Do not combine or repeat tool calls.

Do not call the same tool multiple time with the same value

If a tool result fails or is empty, continue anyway.

FINAL must begin with "Summary:" and contain two parts:

"Non-Technical summary"

"Technical summary"

You must respond with FINAL within 9 iterations.

FINAL must reflect your own insight from the original code — do not copy tool output.
FINAL must have markdown style **ON the value** 
You only have 9 iterations to get what you want, **10th one needs to be "FINAL"**
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
    let response = await AIchat.sendMessage({
      message: "Start",
    });
    while (isRunning && iteration < MAX_ITERATIONS) {
      iteration++;

      try {
        logger.info(response.text.trim());
        const text = AiToolMessageSchema.parse(
          JSON.parse(response.text.trim())
        );

        logger.info(`Iteration:  ${iteration}`);

        if (text["tool"] !== undefined && text["value"] !== undefined) {
          if (
            toolCalls.has(text["tool"]) &&
            text["value"] === toolCalls.get(text["tool"])
          ) {
            logger.info(`Ai repeated`);
            await AIchat.sendMessage({
              message: `You have already used the tool ${text["tool"]} for the value ${text["value"]}`,
            });
            continue;
          }
        }

        toolCalls.set(text["tool"], text["value"]);

        if (text["tool"] === "DirectorySearch") {
          logger.info(`Tool request Directory search:`);
          const toolResult = await DirectorySearch(
            projectGitName,
            projectRepoName
          );
          logger.info(`Result : ${toolResult}`);
          response = await AIchat.sendMessage({
            message: toolResult + `You are on iteration :${iteration}`,
          });
        } else if (text["tool"] === "FileSearch") {
          const search = text["value"];
          logger.info(`Tool request FileSearch:${search}`);

          const toolResult = await FileSearch(
            projectGitName,
            projectRepoName,
            search
          );
          logger.info(`Result : ${toolResult}`);

          response = await AIchat.sendMessage({
            message: toolResult + `You are on iteration :${iteration}`,
          });
        } else if (text["tool"] === "GetMetadata") {
          const search = text["value"];
          logger.info(`Tool request Metadata :${search}`);

          const toolResult = await GetMetadata(
            projectGitName,
            projectRepoName,
            search
          );
          logger.info(`Result : ${toolResult}`);
          response = await AIchat.sendMessage({
            message: toolResult + `You are on iteration :${iteration}`,
          });
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

          response = await AIchat.sendMessage({
            message: toolResult + `You are on iteration :${iteration}`,
          });
        } else if (text["tool"] === "FINAL") {
          logger.info(`Ai final answer :${text.value}`);
          finalResponse = text.value;
          isRunning = false;
        } else {
          logger.error("Tool requested non existing :", text);
          response = await AIchat.sendMessage({
            message: `NOT A VALID RESPONSE, Iteration : ${iteration}`,
          });
        }
      } catch (error) {
        logger.error(`Ai returned an invalid response : ${error}`);
        response = await AIchat.sendMessage({
          message: `NOT A VALID RESPONSE RETURN WITH THIS FORMAT {
  "tool" : "<toolSelected>",
  "value": "<valueSelected>" 
} Iteration${iteration}`,
        });
      }
    }
    return finalResponse;
  } catch (error) {
    console.error(error);
  }
}

export async function commitExplainer(code: string): Promise<string> {
  const systemPrompt = `
  You are an expert software reviewer trained in all programming languages and development best practices. 
  You will be given code diff. 
  Your task is to produce a concise, clear, and insightful review with markdown format
  `;
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
