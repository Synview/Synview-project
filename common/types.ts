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
} from "./schemas.ts";
import { z } from "npm:zod";

export type AppState = { session: Session };
export type Projects = Project[];
export type Updates = Update[];
export type PostUpdate = z.infer<typeof PostUpdateSchema>
export type Update = z.infer<typeof UpdateSchema>
export type PostProject= z.infer<typeof PostProjectSchema>
export type Project = z.infer<typeof ProjectSchema>
export type LoginResponse = {token? : string}

export type UserPayload = z.infer<typeof UserPayloadSchema>;
export type UserInfo = z.infer<typeof UserInfoSchema>;
export type EmailLoginRequestSchema = z.infer<typeof EmailLoginRequestSchema>;
export type EmailRegisterRequestSchema = z.infer<
  typeof EmailRegisterRequestSchema
>;
