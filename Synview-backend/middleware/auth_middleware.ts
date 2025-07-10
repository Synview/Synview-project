import { create, verify } from "@zaubrik/djwt";
import { generateKey, getToken } from "../utils/JWTHelpers.ts";
import { UserPayloadSchema } from "../../common/schemas.ts";
import { UserPayload } from "../../common/types.ts";
import { AppState } from "../../common/types.ts";
import { Context } from "@oak/oak";

export async function createToken(payload: any): Promise<string> {
  const key: CryptoKey = await generateKey();
  return create({ alg: "HS512", typ: "JWT" }, payload, key);
}
export function getPayload(body: UserPayload) {
  try {
    return UserPayloadSchema.parse(body);
  } catch (error) {
    throw new Error("Couldnt parse User Payload" + error);
  }
}
export default async function AuthMiddleware(
  context: Context<AppState>,
  next: () => Promise<unknown>
) {
  try {
    const auth = await context.cookies.get("Authorization");
    if (!auth) {
      throw new Error("No auth header");
    }
    const token = getToken(String(auth));
    if (!token) {
      throw new Error("Couldn't obtain authorization token");
    }
    const key: CryptoKey = await generateKey();
    const payload = await verify(token, key);
    if (!payload) {
      throw new Error("No payload found - invalid token");
    }
    context.response.headers.set("Authorization", `${auth}`);
    await next();
  } catch (err) {
    context.throw(401, "Unauthorized" + err);
  }
}
