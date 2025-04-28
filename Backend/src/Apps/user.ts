import { Hono } from "hono";
import { db } from "../Database/index";
import { userTable } from "../Database/schema";
import { authMiddleware } from "../Middleware/auth";
import { eq } from "drizzle-orm";
import { GetVersion } from "../../lib";

const user = new Hono();

user.use(authMiddleware);
user.get("/", (c) => c.json({ status: "User alive"+GetVersion() }));

user.get("/me", async (c) => {
  // Get the user ID from the request context
  // @ts-ignore - user is added by the authMiddleware
  const user = c.get("user") as { id: string } | undefined;
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Fetch user data from the database
  const userData = await db.select().from(userTable).where(eq(userTable.id, user.id)).limit(1);

  if (!userData.length) {
    return c.json({ error: "User not found" }, 404);
  }

  // Remove sensitive fields
  const { passwordHash, createdAt, updatedAt,  ...safeUserData } = userData[0];

  return c.json(safeUserData);
});



export default user;