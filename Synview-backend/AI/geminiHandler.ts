import { GoogleGenAI } from "@google/genai";
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

export async function recentCodeAnalysis(code: string) {
  const systemPrompt = `
  You are an expert software reviewer trained in all programming languages and development best practices. 
  You will be given commit messages and the code diffs from those commits. 
  Your job is to perform a troughtful review that is useful for both developers doing and reviewing the commits and to non-technical team members.
  Please analyze the changes and respond with the following sections, using clear and respectful and friendly language. 
  Think of it as a summary for someone who is trying to grasp the project idea quickly and treat the response as a formal document without talking to someone, just describe the project


  - What changes were made 
    Briefly summarize the purpose of the changes in simple, non-technical terms. Imagine you're explaining it to a product manager or designer

  - How it works
    Walk trough what the code is doing in a step-by-step, beginner-friendly way. Clarify how the changes solve problems or add functionality

  - Strenghts
    Point out what was done well, for example: clarity, good coding practicees, proper structure, secutiry improvements, etc. based on the projecet focus.

  - Potential Issues or bad practices
    List any bugs, confusing logic, bad patterns, or risk/code smells introduced by the changes, keep this calm and extremely constructive.

  - Developer notes
    If useful, include deeper tecnical notes that a developer would appreciate - such as architectural thoughts, performance trade-offs, or relevant best practices 

    For extra information to keep the diffs info separated correctly, the changes per commit start with diff
    think of it as a summary for someone who is trying to grasp the project idea

 `;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: code,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text;
}

export async function commitAnalysis(code: string) {
  const systemPrompt = `
  You are an expert software reviewer trained in all programming languages and development best practices. 
  You will be given a commit message and the code diff. 
  Your job is to perform a troughtful review that is useful for both developers doing and reviewing the commit and to non-technical team members.
  Please analyze the changes and respond with the following sections, using clear and respectful and friendly language. 
  Think of it as a summary for someone who is trying to grasp the project idea quickly and treat the response as a formal document without talking to someone, just describe the project


  - What changes were made 
    Briefly summarize the purpose of the changes in simple, non-technical terms. Imagine you're explaining it to a product manager or designer

  - How it works
    Walk trough what the code is doing in a step-by-step, beginner-friendly way. Clarify how the changes solve problems or add functionality

  - Strenghts
    Point out what was done well, for example: clarity, good coding practicees, proper structure, secutiry improvements, etc. based on the projecet focus.

  - Potential Issues or bad practices
    List any bugs, confusing logic, bad patterns, or risk/code smells introduced by the changes, keep this calm and extremely constructive.

  - Developer notes
    If useful, include deeper tecnical notes that a developer would appreciate - such as architectural thoughts, performance trade-offs, or relevant best practices 
    Just give the bullet points

  Please provide specific line-by-line suggestions/comments

  

    `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: code,
    config: {
      systemInstruction: systemPrompt,
    },
  });
  return response.text;
}
