import { Hono } from "hono";
import { db } from "../../Database";
import { userTable } from "../../Database/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../../Middleware/auth";

const adminUser = new Hono();

adminUser.use("*", authMiddleware);

adminUser.get("/", async (c) => {
  const allUsers = await db.select().from(userTable);
  return c.json(allUsers);
});

adminUser.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await db.select().from(userTable).where(eq(userTable.id, id));
  if (!user.length) return c.json({ error: "User not found" }, 404);
  return c.json(user[0]);
});

adminUser.patch("/:id/role", async (c) => {
  const id = c.req.param("id");
  const { role } = await c.req.json();

  if (!["user", "admin"].includes(role)) {
    return c.json({ error: "Invalid role" }, 400);
  }

  await db.update(userTable).set({ role }).where(eq(userTable.id, id));
  return c.json({ message: "Role updated successfully" });
});

adminUser.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(userTable).where(eq(userTable.id, id));
  return c.json({ message: "User deleted" });
});

export default adminUser;
