import { Application, Router } from "@oak/oak";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { userRouter } from "./routes/user_routes.ts";
import { updateRouter } from "./routes/update_routes.ts";
import { projectRouter } from "./routes/project_routes.ts";
import { questionRouter } from "./routes/question_routes.ts";
import { invitationRouter } from "./routes/invitation_routes.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
type AppState = {
  session: Session;
};

const mainRouter = new Router();
const app = new Application<AppState>();
const env = Deno.env.toObject();
const PORT = env.PORT || 3000;
app.use(
  oakCors({
    origin: env.DEVURL,
    credentials: true,
    methods: ["POST", "PUT", "DELETE", "GET"],
    allowedHeaders: [
      "Content-type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    exposedHeaders: ["Authorization"],
  })
);
app.use(Session.initMiddleware());

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(projectRouter.routes());
app.use(projectRouter.allowedMethods());

app.use(updateRouter.routes());
app.use(updateRouter.allowedMethods());

app.use(questionRouter.routes());
app.use(questionRouter.allowedMethods());

app.use(invitationRouter.routes());
app.use(invitationRouter.allowedMethods());

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

console.log(`Listening on port ${PORT}`);

await app.listen({ port: Number(PORT) });
