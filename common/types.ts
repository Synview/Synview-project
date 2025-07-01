import {
  UserPayloadSchema,
  UserInfoSchema,
  EmailLoginRequestSchema,
  EmailRegisterRequestSchema,
} from "./schemas.ts";
import { z } from "npm:zod";

export type UserPayload = z.infer<typeof UserPayloadSchema>;
export type UserInfo = z.infer<typeof UserInfoSchema>;
export type EmailLoginRequestSchema = z.infer<typeof EmailLoginRequestSchema>
export type EmailRegisterRequestSchema = z.infer<typeof EmailRegisterRequestSchema>