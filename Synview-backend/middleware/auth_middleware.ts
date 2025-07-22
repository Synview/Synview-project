import { getToken, getKey, verifyGetPayload } from "../utils/JWTHelpers.ts";
import { UserPayloadSchema } from "../../common/schemas.ts";
import { UserPayload } from "../../common/types.ts";
import { Context } from "@oak/oak";
import { Session } from "https://deno.land/x/oak_sessions@v9.0.0/mod.ts";
let key: CryptoKey;
type AppState = {
  session: Session;
};

export function getPayloadFromBody(body: UserPayload) {
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
    const auth = context.cookies.get("Authorization");
    if (!auth) {
      throw new Error("No auth header");
    }
    const token = getToken(String(auth));
    if (!token) {
      throw new Error("Couldn't obtain authorization token");
    }
    key = await getKey();
    const payload = await verifyGetPayload(token, key);
    if (!payload) {
      throw new Error("No payload found - invalid token");
    }
    context.response.headers.set("Authorization", `${auth}`);
    await next();
  } catch (err) {
    context.throw(401, "Unauthorized" + err);
  }
}
