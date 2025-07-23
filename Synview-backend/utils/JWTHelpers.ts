import { Context } from "@oak/oak";
import { create, verify } from "@zaubrik/djwt";

type AppState = {
  session: Session;
};
import { decode } from "@zaubrik/djwt";
import { Session } from "https://deno.land/x/oak_sessions@v9.0.0/mod.ts";
import { rootLogger } from "../../common/Logger.ts";

let key: CryptoKey;

const keySecret = Deno.env.get("AUTH_KEY");
const keyBytes = new TextEncoder().encode(keySecret);
export async function getKey() {
  return await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );
}

export async function createToken(payload: any): Promise<string> {
  key = await getKey();
  return create({ alg: "HS512", typ: "JWT" }, payload, key);
}
export async function verifyGetPayload(token: string, key: CryptoKey) {
  return await verify(token, key);
}
export function getToken(auth: string) {
  const authorization = auth;
  if (!authorization) {
    rootLogger.warn("No authorization in GetToken");
    return null;
  }

  const [method, token] = authorization.split(" ");
  rootLogger.info(authorization);
  if (method !== "Bearer") {
    rootLogger.warn("No bearer");
    return null;
  }
  if (!token) {
    rootLogger.warn("undefined token");
    return null;
  }

  return token;
}

export async function getPayloadFromToken(context: Context<AppState>) {
  try {
    const auth = await context.cookies.get("Authorization");
    if (!auth) {
      rootLogger.warn("null auth (didnt get Authorization correctly)");
      return null;
    }
    const token = getToken(String(auth));
    if (!token) {
      rootLogger.warn("didnt parse authroization correctly");

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
