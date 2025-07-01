import { create, verify, Context, decode } from "../deps.ts";
import { generateKey, getToken } from "../utils/JWTHelpers.ts";
import { Session } from "../deps.ts";
import { UserPayloadSchema } from "../../common/schemas.ts";
import {UserPayload} from "../../common/types.ts"
let key: CryptoKey;
type AppState = {
  session: Session;
};

export async function createToken(payload: any): Promise<string> {
  key = await generateKey();
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
    const auth = context.state.session.get("Authorization");
    if (!auth) {
      throw new Error("No auth header");
    }
    const token = getToken(String(auth));
    if (!token) {
      throw new Error("Couldn't obtain authorization token");
    }

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
export function getPayloadFromToken(context: Context<AppState>) {
  try {
    const auth = context.state.session.get("Authorization");
    if (!auth) {
      return null;
    }
    const token = getToken(String(auth));
    if (!token) {
      return null;
    }

    const [a, payload, b] = decode(token); // need to import all three because if not i dont get payload correctly
    if (!payload) {
      throw new Error("Couldn't get payload");
    }
    return payload;
  } catch (error) {
    context.throw(400, "Error in token" + error);
    return null;
  }
}
