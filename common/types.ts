import {
  UserPayloadSchema,
  UserInfoSchema,
  EmailLoginRequestSchema,
  EmailRegisterRequestSchema,
} from "./schemas.ts";
import { z } from "npm:zod";

export type  Project = {
  ProjectId: number;
  title: string;
  description: string;
  owner_id: number;
  repo_url: string;
  doc_url: string;
  created_at: Date;
}
export type  Projects = Project[];


export type LoginResponse = {token? : string}
export type UserPayload = z.infer<typeof UserPayloadSchema>;
export type UserInfo = z.infer<typeof UserInfoSchema>;
export type EmailLoginRequestSchema = z.infer<typeof EmailLoginRequestSchema>
export type EmailRegisterRequestSchema = z.infer<typeof EmailRegisterRequestSchema>