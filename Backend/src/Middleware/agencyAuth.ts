import { Context, Next } from "hono";
import { env } from "hono/adapter";
import { verify } from "hono/jwt";

/**
 * Middleware to authenticate agency requests using JWT tokens.
 * Ensures that only users with the 'agency' role can access protected routes.
 * 
 * @param c The request context.
 * @param next The next middleware in the chain.
 */
export const agencyAuth = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(token, env(c).JWT_SECRET);
    if (payload.role !== "agency") {
      return c.json({ error: "Access denied. Agency role required." }, 403);
    }

    c.set("agency", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};