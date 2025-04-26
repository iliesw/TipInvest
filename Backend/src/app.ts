import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./Apps/auth";
import user from "./Apps/user";
import admin from "./Apps/admin/index";
import transaction from "./Apps/transaction";
import realestate from "./Apps/realestate";
import agency from "./Apps/agency/index";
import expert from "./Apps/expert/index";
import client from "./Apps/client/index";
import { GetVersion } from "../lib";
import { corsHandler } from "./corsHandler";

const app = new Hono();

// Enable CORS for all routes
app.use('*', corsHandler); // 👈 apply cors to all requests

app.get('/', (c) => c.text('Server Up' + GetVersion()));

app.route("/auth", auth);
app.route("/user", user);
app.route("/admin", admin);
app.route("/realestate", realestate);
app.route("/transaction", transaction);
app.route("/agency", agency);
app.route("/expert", expert);
app.route("/client", client);

export default app;


