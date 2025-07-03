import { Application, Router } from "@oak/oak";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { UserRouter } from "./routes/user_routes.ts";
import { updateRouter } from "./routes/update_routes.ts";
import { projectRouter } from "./routes/project_routes.ts";
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

app.use(UserRouter.routes());
app.use(UserRouter.allowedMethods());

app.use(projectRouter.routes());
app.use(projectRouter.allowedMethods());

app.use(updateRouter.routes());
app.use(updateRouter.allowedMethods());

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

console.log(`Listening on port ${PORT}`);

await app.listen({ port: Number(PORT) });
