import { z } from "npm:zod";
import { ProjectRoles } from "../Synview-backend/generated/prisma/client.ts";
import { invitation_status } from "../Synview-backend/generated/prisma/client.ts";

export const InvitationSchema = z.object({
  project_invitation_id: z.number(),
  invited_project_id: z.number(),
  invited_user_id: z.number(),
  inviting_user_id: z.number(),
  invited_at: z.date().optional(),
  accepted_at: z.date().optional(),
  role: z.nativeEnum(ProjectRoles).optional(),
  status: z.nativeEnum(invitation_status).optional(),
});

export const PostInvitationSchema = z.object({
  invited_project_id: z.number(),
  invited_user_id: z.number(),
  inviting_user_id: z.number(),
  role: z.nativeEnum(ProjectRoles),
});
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
