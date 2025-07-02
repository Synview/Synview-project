import {
  UserPayloadSchema,
  UserInfoSchema,
  EmailLoginRequestSchema,
  EmailRegisterRequestSchema,
  ProjectSchema,
  PostProjectSchema,
} from "./schemas.ts";
import { z } from "npm:zod";

export type Projects = Project[];
export type PostProject= z.infer<typeof PostProjectSchema>
export type Project = z.infer<typeof ProjectSchema>
export type LoginResponse = {token? : string}
export type UserPayload = z.infer<typeof UserPayloadSchema>;
export type UserInfo = z.infer<typeof UserInfoSchema>;
export type EmailLoginRequestSchema = z.infer<typeof EmailLoginRequestSchema>
export type EmailRegisterRequestSchema = z.infer<typeof EmailRegisterRequestSchema>