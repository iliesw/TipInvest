import { Hono } from "hono";
import { sign } from "hono/jwt";
import { db } from "../../Database/index";
import { userTable } from "../../Database/schema";
import { eq } from "drizzle-orm";
import { env } from "hono/adapter";
import * as dotenv from 'dotenv';

const adminAuth = new Hono();

adminAuth.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  // @ts-ignore
  const user = await db.select().from(userTable).where(eq(userTable.email, email));
  
  if (!user.length || user[0].role !== "admin") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const jwtSecret = env(c).JWT_SECRET as string;
  const token = await sign({ id: user[0].id, role: user[0].role }, jwtSecret);
  return c.json({ token });
});

export default adminAuth;
