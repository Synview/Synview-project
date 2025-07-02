import { Application, Router, oakCors } from "./deps.ts";
import { router } from "./routes/user_routes.ts";
import { Session } from "./deps.ts";
type AppState = {
  session: Session;
};

const mainRouter = new Router();
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

app.use(router.routes());
app.use(router.allowedMethods());

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

console.log(`Listening on port ${PORT}`);

await app.listen({ port: Number(PORT) });
