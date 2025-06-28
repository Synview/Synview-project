import { create, verify, Context, decode } from "../deps.ts";
import { z } from "zod";
import getToken from "./jwt.ts";
import { Session } from "../deps.ts"
/// Token Auth
let key: CryptoKey;
type AppState = {
    session: Session
}

export const UserPayload = z.object({
  ["username"]: z.string(),
  ["role"]: z.string(),
  ["id"]: z.number(),
});

export async function createToken(payload: any): Promise<string> {
  key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );

  return create({ alg: "HS512", typ: "JWT" }, payload, key);
}
export function getPayload(body: any) {
  try {
    const parsedBody = UserPayload.parse(body);
    return { ...parsedBody };
  } catch (error) {
    throw new Error("Couldnt parse User Payload" + error);
  }
}

export default async function AuthMiddleware(
  context: Context<AppState>,
  next: () => Promise<unknown>
) {
  try {
    const auth = context.state.session.get("Authorization")
    if(!auth){
      throw new Error("No auth header")
    }
    const token = getToken(String(auth));
    if (!token) {
      throw new Error("Couldn't obtain authorization token");
    }

    const payload = await verify(token, key);
    if (!payload) {
      throw new Error("No payload found");
    }
    await next();
  } catch (err) {
    context.throw(401, "Unauthorized" + err);
  }
}

export function getPayloadFromToken(context: Context) {
  try {
    const headers = context.request.headers
    const auth = headers.get("Authorization")
    if(!auth){
      return null;
    }
    const token = getToken(auth);
    if (!token) {
      return null;
    }

    const [header, payload, signature] = decode(token);
    if (!payload) {
      throw new Error("Couldn't get payload");
    }
    return payload;
  } catch (error) {
    context.throw(400, "Error in token" + error);
    return null
  }
}
