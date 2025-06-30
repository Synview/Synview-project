import { Application, Router, oakCors } from "./deps.ts";
import { UserRouter } from "./routes/user_routes.ts";
import { ProjectRouter} from './routes/project_routes.ts'
import { Session } from "./deps.ts";
type AppState = {
  session: Session;
};
// import { parse } from "node:path";

const Mainrouter = new Router();
const app = new Application<AppState>();
const env = Deno.env.toObject();
const PORT = env.PORT || 3000;
app.use(
  oakCors({
    origin: "http://localhost:5174",
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
app.use(ProjectRouter.routes());
app.use(ProjectRouter.allowedMethods());

app.use(Mainrouter.routes());
app.use(Mainrouter.allowedMethods());

console.log(`Listening on port ${PORT}`);

await app.listen({ port: Number(PORT) });
