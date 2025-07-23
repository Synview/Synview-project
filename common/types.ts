import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import {
  UserPayloadSchema,
  UserInfoSchema,
  EmailLoginRequestSchema,
  EmailRegisterRequestSchema,
  ProjectSchema,
  PostProjectSchema,
  UpdateSchema,
  PostUpdateSchema,
  PostQuestionSchema,
  QuestionSchema,
  PostInvitationSchema,
  InvitationSchema,
  GithubInfoSchema,
  UserDataSchema,
  UserModelSchema,
  AiToolMessageSchema,
  MessageSchema,
} from "./schemas.ts";
import { z } from "npm:zod";

export type AiTool = z.infer<typeof AiToolMessageSchema>;

export type AppState = { session: Session };
export type Projects = Project[];
export type Updates = Update[];

export type GithubInfo = z.infer<typeof GithubInfoSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Invitation = z.infer<typeof InvitationSchema>;
export type PostInvitaion = z.infer<typeof PostInvitationSchema>;
export type PostQuestion = z.infer<typeof PostQuestionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;
export type Update = z.infer<typeof UpdateSchema>;

export type PostProject = z.infer<typeof PostProjectSchema>;
export type Project = z.infer<typeof ProjectSchema>;

export type UserPayload = z.infer<typeof UserPayloadSchema>;
export type UserData = z.infer<typeof UserDataSchema>;
export type LoginResponse = { token?: string };
export type UserInfo = z.infer<typeof UserInfoSchema>;
export type User = z.infer<typeof UserModelSchema>;
export type EmailLoginRequestSchema = z.infer<typeof EmailLoginRequestSchema>;
export type EmailRegisterRequestSchema = z.infer<
  typeof EmailRegisterRequestSchema
>;
