import { Context, Next } from "hono";
import { env } from "hono/adapter";
import { verify } from "hono/jwt";
import * as jwt from "jsonwebtoken";



/**
 * Middleware to authenticate requests using JWT tokens.
 * 
 * @param c The request context.
 * @param next The next middleware in the chain.
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
};


export const adminAuth = async (c: any, next: any) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(token, env(c).JWT_SECRET);
    if (payload.role !== "admin") {
      return c.json({ error: "Access denied" }, 403);
    }

    c.set("admin", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};
