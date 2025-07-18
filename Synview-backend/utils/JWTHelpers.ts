import { Context } from "@oak/oak";
import { create, verify } from "@zaubrik/djwt";

import { AppState } from "../../common/types.ts";
import { decode } from "@zaubrik/djwt";

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
export async function verifyGetPayload(token: string, key : CryptoKey) {
  return await verify(token, key);
}
export function getToken(auth: string) {
  const authorization = auth;
  if (!authorization) {
    return null;
  }

  const [method, token] = authorization.split(" ");

  if (method !== "Bearer") {
    return null;
  }
  if (!token) {
    return null;
  }

  return token;
}

export async function getPayloadFromToken(context: Context<AppState>) {
  try {
    const auth = await context.cookies.get("Authorization");
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
