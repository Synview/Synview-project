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
