import { Router } from "@oak/oak";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/client.ts";
import { hash, verify as bycryptVerify } from "@felix/bcrypt";
import { createToken, getPayload } from "../middleware/auth_middleware.ts";
import { getPayloadFromToken } from "../utils/JWTHelpers.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import {
  EmailLoginRequestSchema,
  EmailRegisterRequestSchema,
  InvitationSchema,
} from "../../common/schemas.ts";
import { PostInvitationSchema } from "../../common/schemas.ts";
import AuthMiddleware from "../middleware/auth_middleware.ts";
type AppState = {
  session: Session;
};
const userRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

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

    const hashedPassword = await hash(password);

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
        id: user.user_id,
      };

      const access_token = await createToken(getPayload(userPayload));
      context.response.body = {
        token: access_token,
      };

      context.state.session.set("Authorization", `Bearer ${access_token}`);
      context.response.headers.set("Authorization", `Bearer ${access_token}`);
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
  .get("/getPayload", (context) => {
    const payload = getPayloadFromToken(context);
    context.response.body = payload;
  })
  .post("/inviteUser", async (context) => {
    try {
      const Invite = PostInvitationSchema.parse(
        await context.request.body.json()
      );
      await prisma.project_invitation.create({
        data: Invite,
      });
      context.response.status = 201;
      context.response.body = {
        messae: "Invited user succesfully!",
      };
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
        data: { status: "COMPLETE" },
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
