import { Application, Router } from "@oak/oak";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { userRouter } from "./routes/user_routes.ts";
import { updateRouter } from "./routes/update_routes.ts";
import { projectRouter } from "./routes/project_routes.ts";
import { questionRouter } from "./routes/question_routes.ts";
import { githubRouter } from "./routes/github_routes.ts";
import { wsRouter } from "./websocket/websocket_route.ts";
import { invitationRouter } from "./routes/invitation_routes.ts";
import { aiRouter } from "./routes/ai_routes.ts";
import { webhookRouter } from "./routes/webhook_route.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { rootLogger } from "../common/Logger.ts";

type AppState = {
  session: Session;
};

const mainRouter = new Router();
const app = new Application<AppState>({ proxy: true });
const env = Deno.env.toObject();
const PORT = env.PORT || 3000;
const allowedOrigins = [env.DEVURL, env.PRODURL];
rootLogger.info(env.PRODURL);
app.use(
  oakCors({
    origin: (reqOrigin) => {
      if (allowedOrigins.includes(reqOrigin)) {
        return reqOrigin;
      }
      return undefined;
    },
    credentials: true,
    methods: ["POST", "PUT", "DELETE", "GET"],
    allowedHeaders: [
      "Content-type",
      "Authorization",
      "X-Debug",
    ],
  })
);

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(projectRouter.routes());
app.use(projectRouter.allowedMethods());

app.use(updateRouter.routes());
app.use(updateRouter.allowedMethods());

app.use(questionRouter.routes());
app.use(questionRouter.allowedMethods());

app.use(githubRouter.routes());
app.use(githubRouter.allowedMethods());

app.use(wsRouter.routes());
app.use(wsRouter.allowedMethods());

app.use(invitationRouter.routes());
app.use(invitationRouter.allowedMethods());

app.use(aiRouter.routes());
app.use(aiRouter.allowedMethods());

app.use(webhookRouter.routes());
app.use(webhookRouter.allowedMethods());

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

console.log(`Listening on port ${PORT}`);

await app.listen({ port: Number(PORT) });
