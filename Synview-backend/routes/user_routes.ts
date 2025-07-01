import { withAccelerate, PrismaClient, Router } from "../deps.ts";
import { hash, bycryptVerify } from "../deps.ts";
import {
  createToken,
  getPayload,
  getPayloadFromToken,
} from "../middleware/auth_middleware.ts";
import { Session } from "../deps.ts";

import AuthMiddleware from "../middleware/auth_middleware.ts";
import { z } from "zod";
type AppState = {
  session: Session;
};
const UserRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

export const EmailRegisterRequestSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});
export const EmailLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});



UserRouter
  .post("/register", async (context) => {
    const body = await context.request.body.json();
    const { username, email, password } = EmailRegisterRequestSchema.parse(body);
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
          username: username,
        },
      });

      const existingEmail = await prisma.user.findFirst({
        where: {
          email: email,
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

    await prisma.user.create({
      data: { username: username, email: email, passwordHash: hashedPassword },
    });
    context.response.body = "New user created!";
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

      const userPayload = {
        username: user.username,
        role: user.role,
        id: user.UserId,
      };

      const access_token = await createToken(getPayload(userPayload));
      context.response.body = {
        message: "Login successfull!",
      };

      context.state.session.set("Authorization", `Bearer ${access_token}`);
      context.response.headers.set("Authorization", `Bearer ${access_token}`);
    } catch (e) {
      context.response.status = 500;
      context.response.body = {
        error: "Login went wrong",
        e,
      };
      return;
    }
  });

UserRouter.use(AuthMiddleware);
// router.use(token);

UserRouter.get("/getPayload", (context) => {
  const payload = getPayloadFromToken(context);
  context.response.body = payload;
});

export { UserRouter };
