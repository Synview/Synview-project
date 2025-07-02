import { z } from "npm:zod";

 interface Project {
    ProjectId: number;
    title: string;
    description: string;
    owner_id: number;
    repo_url?: string;
    doc_url?: string;
    created_at: Date;
  }
  
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
