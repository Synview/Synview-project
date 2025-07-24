import { Router } from "@oak/oak";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/client.ts";
import bcrypt from "bcryptjs";
import { getPayloadFromBody } from "../middleware/auth_middleware.ts";
import { getPayloadFromToken } from "../utils/JWTHelpers.ts";
import { createToken } from "../utils/JWTHelpers.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

import {
  EmailLoginRequestSchema,
  EmailRegisterRequestSchema,
  InvitationSchema,
} from "../../common/schemas.ts";
import { PostInvitationSchema } from "../../common/schemas.ts";
import AuthMiddleware from "../middleware/auth_middleware.ts";
import { rootLogger } from "../../common/Logger.ts";
type AppState = {
  session: Session;
};

const userRouter = new Router<AppState>();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Deno.env.get("DATABASE_URL")!,
    },
  },
}).$extends(withAccelerate());
const ONE_WEEK_MS = 168 * 60 * 60 * 1000;
userRouter
  .post("/register", async (context) => {
    const body = await context.request.body.json();
    const { username, email, password } =
      EmailRegisterRequestSchema.parse(body);
    try {
      if (!username || !email || !password) {
        context.response.status = 400;
        context.response.body = {
          error: "Recieved invalid request",
        };
        return;
      }

      const existingUser = await prisma.users.findFirst({
        where: {
          username: username,
        },
      });

      const existingEmail = await prisma.users.findFirst({
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
      context.response.status = 500;
      context.response.body = {
        error: "Error: " + error,
      };
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: { username: username, email: email, passwordHash: hashedPassword },
    });
    context.response.status = 201;
    context.response.body = { message: "New user created!" };
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

      const user = await prisma.users.findFirst({
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

      const isValidPassowrd = await bcrypt.compare(password, user.passwordHash);

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
        id: user.user_id,
      };

      const access_token = await createToken(getPayloadFromBody(userPayload));

      rootLogger.info(context.request.headers.get("x-forwarded-proto"));
      const isSecure =
        context.request.headers.get("x-forwarded-proto") === "https";

      await context.cookies.set("Authorization", `Bearer ${access_token}`, {
        expires: new Date(Date.now() + 168 * 60 * 60 * 1000),
        sameSite: isSecure ? "none" : "lax",
        secure: isSecure,
        httpOnly: true,
        path: "/",
      });
      context.response.status = 200;
      context.response.body = {
        token: access_token,
      };
      await context.cookies.set("Authorization", `Bearer ${access_token}`, {
        expires: new Date(Date.now() + ONE_WEEK_MS),
        sameSite: "lax",
        httpOnly: true,
      });
    } catch (e) {
      context.response.status = 500;
      context.response.body = {
        error: "Login went wrong" + e,
      };
      return;
    }
  });

userRouter.use(AuthMiddleware);

userRouter
  .get("/getUser/:id", async (context) => {
    const id = context.params.id;
    try {
      const user = await prisma.users.findUnique({
        where: { user_id: Number(id) },
        select: {
          user_id: true,
          username: true,
          email: true,
          role: true,
        },
      });
      if (user === null) {
        context.response.status = 404;
        context.response.body = { error: "User not found" };
      } else {
        context.response.body = user;
      }
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Error getting user by id: " + error,
      };
    }
  })
  .get("/getPayload", async (context) => {
    const payload = await getPayloadFromToken(context);
    context.response.body = payload;
  })
  .post("/logout", async (context) => {
    try {
      await context.cookies.delete("Authorization");
      context.response.status = 200;
      context.response.body = {
        messae: "Logout user succesfully!",
      };
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Logout failed, error : " + error,
      };
    }
  })
  .post("/inviteUser", async (context) => {
    try {
      const Invite = PostInvitationSchema.parse(
        await context.request.body.json()
      );

      const invitedUser = await prisma.users.findFirst({
        where: { username: Invite.invited_username },
      });
      if (invitedUser) {
        await prisma.project_invitation.create({
          data: {
            invited_user_id: invitedUser.user_id,
            inviting_user_id: Invite.inviting_user_id,
            invited_project_id: Invite.invited_project_id,
            role: Invite.role,
          },
        });
        context.response.status = 201;
        context.response.body = {
          messae: "Invited user succesfully!",
        };
      } else {
        rootLogger.error(
          `Couldn't find invites user for id ${Invite.invited_project_id}, name : ${Invite.invited_username}`
        );
        throw new Error(
          `Couldn't find invited user : ${Invite.invited_username}`
        );
      }
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "inviteUser error : " + error,
      };
    }
  })
  .put("/acceptInvitations", async (context) => {
    try {
      const Invite = InvitationSchema.parse(await context.request.body.json());
      await prisma.project_invitation.update({
        where: {
          project_invitation_id: Invite.project_invitation_id,
        },
        data: { status: "COMPLETE", accepted_at: new Date() },
      });
      await prisma.user_projects.create({
        data: {
          project_id: Invite.invited_project_id,
          user_id: Invite.invited_user_id,
          role: "REVIEWER",
        },
      });
      context.response.status = 201;
      context.response.body = {
        message: "accepted invitation successfully!",
      };
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "accepted invitations error : " + error,
      };
    }
  })
  .get("/getInvitations/:id", async (context) => {
    const id = context.params.id;
    try {
      const Invitations = await prisma.project_invitation.findMany({
        where: { invited_user_id: parseInt(id) },
      });
      context.response.body = Invitations;
    } catch (error) {
      context.response.status = 500;
      context.response.body = {
        error: "Error getting invitations: " + error,
      };
    }
  });

export { userRouter };
