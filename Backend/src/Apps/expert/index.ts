import { Hono } from "hono";
import { jwt } from "hono/jwt";
import profile from "./profile";
import meetings from "./meetings";
import uploadProfilePicture from "./uploadProfilePicture";
import getProfilePicture from "./getProfilePicture";
import { GetVersion } from "../../../lib";

const expert = new Hono();

// JWT middleware for authentication
expert.use(
  "*",
  jwt({
    secret: process.env.JWT_SECRET!,
    cookie: "auth",
  })
);

// Check if the user has the expert role
expert.use("*", async (c, next) => {
  const payload = c.get("jwtPayload");
  if (payload.role !== "expert") {
    return c.json({ error: "Unauthorized. Expert access required." }, 403);
  }
  await next();
});

expert.get("/", (c) => c.json({ status: "Expert API alive " + GetVersion() }));

// Route to expert profile management
expert.route("/profile", profile);

// Route to expert meetings management
expert.route("/meetings", meetings);

// Route to upload profile picture
expert.route("/profile/upload-picture", uploadProfilePicture);

// Route to get profile picture
expert.route("/profile/picture", getProfilePicture);

export default expert;