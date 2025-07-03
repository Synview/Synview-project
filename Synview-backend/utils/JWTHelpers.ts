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