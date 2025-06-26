import {
  serve,
  withAccelerate,
  PrismaClient,
  Application,
  Router,
} from "../deps.ts";
import { hash, bycryptVerify } from "../deps.ts";

import { create, getNumericDate, verify } from "../deps.ts";

import AuthMiddleware from "../middleware/auth_middleware.ts";
import { z } from "zod";
const app = new Application();
const router = new Router();
const unprotectedRouter = new Router();
const prisma = new PrismaClient().$extends(withAccelerate());

export const EmailRegisterRequestSchema = z.object({
  ["username"]: z.string(),
  ["email"]: z.string().email(),
  ["password"]: z.string(),
});
export const EmailLoginRequestSchema = z.object({
  ["email"]: z.string().email(),
  ["password"]: z.string(),
});

/// Token Auth
async function getToken(payload: any): Promise<string> {
  const secret = Deno.env.get("API_SECRET") as string;
  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );

  return create({ alg: "HS512", typ: "JWT" }, payload, key);
}
function getPayload(body: any) {
  const parsedBody = EmailLoginRequestSchema.parse(body);
  return { ...parsedBody };
}

///
unprotectedRouter.post("/register", async (context) => {
  const body = await context.request.body.json();
  const parsedBody = EmailRegisterRequestSchema.parse(body);

  const { username, email, password } = parsedBody;
  try {
    if (!username || !email || !password) {
      context.response.status = 400;
      context.response.body = {
        error: "Recieved invalid request",
      };
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username: String(username),
      },
    });

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: String(email),
      },
    });

    if (existingUser || existingEmail) {
      context.response.status = 400;
      context.response.body = {
        error: "Username or Email, already taken",
      };
      return;
    }
  } catch (error) {
    context.response.status = 400;
    context.response.body = {
      error: error,
    };
    return;
  }

  const hashedPassword = await hash(password);

  const newUser = await prisma.user.create({
    data: { username: username, email: email, passwordHash: hashedPassword },
  });
  context.response.body = newUser;
});

// router.use(AuthMiddleware);

router
  .get("/", (context) => {
    context.response.body = "this is the user route!";
  })
  .post("/login", async (context) => {
    const body = await context.request.body.json();
    try {
      const parsedBody = EmailLoginRequestSchema.parse(body);
      const { password, email } = parsedBody;

      if (!email || !password) {
        context.response.status = 400;
        context.response.body = {
          error: "Recieved invalid login request",
        };
        return;
      }

      const user = await prisma.user.findFirst({
        where: {
          email: String(email),
        },
      });

      if (!user) {
        context.response.status = 400;
        context.response.body = {
          error: "Email doesn't exist",
        };
        return;
      }

      const isValidPassowrd = await bycryptVerify(password, user.passwordHash);

      if (!isValidPassowrd) {
        context.response.status = 400;
        context.response.body = {
          error: "Wrong password",
        };
        return;
      }

      context.response.body = {
        message: "Login successfull!",
      };
    } catch (e) {
      context.response.status = 400;
      context.response.body = {
        error: "Incorrect email format",
      };
      return;
    }
  });

export { router, unprotectedRouter };
