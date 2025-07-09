import { Router } from "@oak/oak";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { InvitationSchema } from "../../common/schemas.ts";
import { PostInvitationSchema } from "../../common/schemas.ts";
import AuthMiddleware from "../middleware/auth_middleware.ts";
type AppState = {
  session: Session;
};
const invitationRouter = new Router<AppState>();
const prisma = new PrismaClient().$extends(withAccelerate());

invitationRouter.use(AuthMiddleware);

invitationRouter
  .post("/inviteUser", async (context) => {
    try {
      const invite = PostInvitationSchema.parse(
        await context.request.body.json()
      );
      await prisma.project_invitation.create({
        data: invite,
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
      const invite = InvitationSchema.parse(await context.request.body.json());
      await prisma.project_invitation.update({
        where: {
          project_invitation_id: invite.project_invitation_id,
        },
        data: { status: "COMPLETE" },
      });
      await prisma.user_projects.create({
        data: {
          project_id: invite.invited_project_id,
          user_id: invite.invited_user_id,
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

export { invitationRouter };
