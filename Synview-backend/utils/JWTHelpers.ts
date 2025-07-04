import { Context } from "../deps.ts";
export default async function Token(
  context: Context,
  next: () => Promise<unknown>
) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    context.response.headers.set("Authorization", `Bearer ${token}`)
    await next();
  } catch (e) {
    throw new Error("Didnt find any auth token: " + e);
  }
}
export async function generateKey() {
  return await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
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