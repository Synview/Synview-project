export default function getToken(auth: string) {
  const authorization = auth
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
