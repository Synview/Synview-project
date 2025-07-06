import { z } from "npm:zod";

export const QuestionSchema = z.object({
  question_id: z.number(),
  content: z.string(),
  created_at: z.date(),
  update_id: z.number(),
  user_id: z.number(),
});
export const PostQuestionSchema = z.object({
  content: z.string(),
  update_id: z.number(),
  user_id: z.number(),
});
export const ProjectSchema = z.object({
  ProjectId: z.number(),
  title: z.string(),
  description: z.string(),
  owner_id: z.number(),
  repo_url: z.string().optional(),
  doc_url: z.string().optional(),
  created_at: z.date(),
});

export const PostUpdateSchema = z.object({
  description: z.string(),
  user_id: z.number(),
  project_id: z.number(),
});

export const UpdateSchema = z.object({
  UpdateId: z.number(),
  Comments: z.string(),
  summary: z.string().optional(),
  code_changes: z.string().optional(),
  created_at: z.date(),
  UserId: z.number(),
  ProjectId: z.number(),
});

export const PostProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  owner_id: z.number(),
  repo_url: z.string().optional(),
  doc_url: z.string().optional(),
});

export const UserPayloadSchema = z.object({
  username: z.string(),
  role: z.string(),
  id: z.number(),
});
export const UserInfoSchema = z.object({
  username: z.string(),
  role: z.string(),
  id: z.number(),
});

export const EmailLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const EmailRegisterRequestSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});
