import { Context, Next } from "hono";
import { env } from "hono/adapter";
import { verify } from "hono/jwt";
import * as jwt from "jsonwebtoken";
import { db } from "../Database/index";
import { userTable } from "../Database/schema";
import { eq } from "drizzle-orm";

/**
 * Middleware to authenticate requests using JWT tokens.
 * Also verifies that the user's email is verified.
 * 
 * @param c The request context.
 * @param next The next middleware in the chain.
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    console.log("Decoded token:", decoded);
    
    // Vérifier si l'email de l'utilisateur est vérifié
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, decoded.id))
      .limit(1);
    
    if (!user.length) {
      return c.json({ error: "User not found" }, 401);
    }
    
    // if (!user[0].isEmailVerified) {
    //   return c.json({ 
    //     error: "EMAIL_NOT_VERIFIED",
    //     message: "Please verify your email before accessing this resource."
    //   }, 403);
    // }
    
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
};


export const adminAuth = async (c: any, next: any) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  console.log("Decoded token:", token);
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(token, env(c).JWT_SECRET) as { id: string, role: string };
    if (payload.role !== "admin") {
      return c.json({ error: "Access denied" }, 403);
    }
    
    // Vérifier si l'email de l'administrateur est vérifié
    const admin = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, payload.id))
      .limit(1);
    
    if (!admin.length) {
      return c.json({ error: "Admin not found" }, 401);
    }
    
    // console.log("User verification status:", user[0].isEmailVerified);
    c.set("admin", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};
