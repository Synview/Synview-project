import { userInfo } from "node:os";
import {
  serve,
  withAccelerate,
  PrismaClient,
  Application,
  Router,
} from "./deps.ts";
import { z } from "zod";
import { router, unprotectedRouter} from "./routes/user_routes.ts";
// import { parse } from "node:path";

const prisma = new PrismaClient().$extends(withAccelerate());
const Mainrouter = new Router();
const app = new Application();

const env = Deno.env.toObject();
const PORT = env.PORT || 3000;


app.use(router.routes());
app.use(router.allowedMethods());
app.use(unprotectedRouter.routes());
app.use(unprotectedRouter.allowedMethods());

app.use(Mainrouter.routes());
app.use(Mainrouter.allowedMethods());

console.log(`Listening on port ${PORT}`);

await app.listen({ port: 8080 });
