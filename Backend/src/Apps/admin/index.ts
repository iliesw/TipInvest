import { Hono } from "hono";
import adminDashBoard from "./dashboard";
import adminUser from "./users";
import adminRealestate from "./realestate";
import adminTransaction from "./transactions";
import adminAuth from "./auth";
import { GetVersion } from "../../../lib";
const admin = new Hono();

admin.route("/dashboard",adminDashBoard);
admin.route("/users",adminUser);
admin.route("/realestate",adminRealestate);
admin.route("/transactions",adminTransaction);
admin.route("/auth",adminAuth);

admin.get("/", async (c) => {
  return c.json({ message: "Admin Up "+GetVersion() });
});

export default admin;