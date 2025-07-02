import { z } from "../Synview-backend/deps.ts";

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
  ["email"]: z.string().email(),
  ["password"]: z.string(),
});

export const EmailRegisterRequestSchema = z.object({
  ["username"]: z.string(),
  ["email"]: z.string().email(),
  ["password"]: z.string(),
});
