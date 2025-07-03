import { Context } from "@oak/oak";
import { AppState } from "../../common/types.ts";
import { decode } from "@zaubrik/djwt";

const key = Deno.env.get("AUTH_KEY");
const keyBytes = new TextEncoder().encode(key)
export async function generateKey() {
  return await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  );
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
