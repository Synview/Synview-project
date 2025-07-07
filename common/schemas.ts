import { number, z } from "npm:zod";

export const ProjectSchema = z.object({
  ProjectId: z.number(),
  title: z.string(),
  description: z.string(),
  owner_id: z.number(),
  repo_url: z.string().optional(),
  doc_url: z.string().optional(),
  created_at: z.date(),
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
