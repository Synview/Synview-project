import { getToken, getKey, verifyGetPayload } from "../utils/JWTHelpers.ts";
import { UserPayloadSchema } from "../../common/schemas.ts";
import { UserPayload } from "../../common/types.ts";
import { Context } from "@oak/oak";
import { Session } from "https://deno.land/x/oak_sessions@v9.0.0/mod.ts";
import { rootLogger } from "../../common/Logger.ts";
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
    // Check for token in Authorization header first
    let auth = context.request.headers.get("Authorization");
    
    // If not in header, check cookie
    
    if (!auth) {
      const cookieAuth = await context.cookies.get("Authorization");
      if (cookieAuth) {
        rootLogger.info("Got auth from cookie")
        auth = cookieAuth;
      }
    }
    
    if (!auth) {
      throw new Error("No auth token found in header or cookie");
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
    context.throw(401, "Unauthorized: " + err);
  }
}
