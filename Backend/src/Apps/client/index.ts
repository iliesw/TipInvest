import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import meetings from "./meetings";
import expert from "./experts";
import reviews from "./reviews";
import { GetVersion } from "../../../lib";

const client = new Hono();

// JWT middleware for authentication
client.use(
  "*",
  jwt({
    secret: process.env.JWT_SECRET!,
    cookie: "auth",
  })
);

// Check if the user has the client/user role
client.use("*", async (c, next) => {
  const payload = c.get("jwtPayload");
  if (payload.role !== "client") {
    return c.json({ error: "Unauthorized. Client access required." }, 403);
  }
  await next();
});

client.get("/", (c) => c.json({ status: "Client API alive " + GetVersion() }));

// Route to client meetings management
client.route("/meetings", meetings);
// Route to client expert management
client.route("/experts", expert);
client.route("/reviews", reviews);

export default client;