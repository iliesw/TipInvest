import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./Apps/auth";
import user from "./Apps/user";
import admin from "./Apps/admin/index";
import transaction from "./Apps/transaction";
import realestate from "./Apps/realestate";
import agency from "./Apps/agency/index";
import { GetVersion } from "../lib";

const app = new Hono();

// Enable CORS for all routes
app.use('*', cors());

app.get('/', (c) => c.text('Server Up' + GetVersion()));

app.route("/auth", auth);
app.route("/user", user);
app.route("/admin", admin);
app.route("/realestate", realestate);
app.route("/transaction", transaction);
app.route("/agency", agency);

export default app;