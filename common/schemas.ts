import { z } from "npm:zod";
export const project_roles = ["CREATOR", "VIEWER", "REVIEWER"] as const;
export const invitation_status = ["PENDING", "COMPLETE"] as const;
export const ProjectRolesSchema = z.enum(project_roles);
export const InvitationStatusSchema = z.enum(invitation_status);

export const MessageSchema = z.object({
  channel: z.string(),
  data: z.object({}),
});

export const UserDataSchema = z.object({
  email: z.string(),
  user_id: z.string(),
  username: z.string(),
  role: ProjectRolesSchema,
});

export const GithubInfoSchema = z.object({
  github_user: z.string(),
  repo_name: z.string(),
  user_id: z.number(),
  project_id: z.number(),
});

export const InvitationSchema = z.object({
  project_invitation_id: z.number(),
  invited_project_id: z.number(),
  invited_user_id: z.number(),
  inviting_user_id: z.number(),
  invited_at: z.date().optional(),
  accepted_at: z.date().optional(),
  role: ProjectRolesSchema,
  status: InvitationStatusSchema.optional(),
});

export const PostInvitationSchema = z.object({
  invited_project_id: z.number(),
  invited_user_id: z.number(),
  inviting_user_id: z.number(),
  role: ProjectRolesSchema,
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
  project_id: z.number(),
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
  update_id: z.number(),
  description: z.string(),
  summary: z.string().optional(),
  sha: z.string().optional(),
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
