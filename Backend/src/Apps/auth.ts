import { Hono } from "hono";
import { db } from "../Database/index";
import { userTable } from "../Database/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { GetVersion } from "../../lib";

const auth = new Hono();

auth.get("/", (c) => c.json({ status: "Auth alive "+GetVersion() }));

/**
 * Registers a new user.
 * 
 * Endpoint: POST /register
 * Request Body: { name: string, email: string, password: string }
 * Response: { message: string }
 */
auth.post("/register", async (c) => {
  // Parse the request body
  const { name, email, password } = await c.req.json() as { name: string, email: string, password: string };

  console.log(name, email, password)
  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into the database
  await db.insert(userTable).values({
    name: name,
    email: email,
    passwordHash: hashedPassword,
  });

  return c.json({ message: "User registered successfully" });
});

/**
 * Logs in an existing user.
 * 
 * Endpoint: POST /login
 * Request Body: { email: string, password: string }
 * Response: { token: string } | { error: string }
 */
auth.post("/login", async (c) => {
  // Parse the request body
  const { email, password } = await c.req.json() as { email: string, password: string };

  // Find the user in the database by email
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email as string))
    .limit(1);

  // Validate user existence and password correctness
  if (!user.length || !(await bcrypt.compare(password, user[0].passwordHash))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // Generate a JWT token for authentication
  const token = jwt.sign(
    { id: user[0].id, role: user[0].role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d"}
  );

  return c.json({ token });
});

/**
 * Checks the availability of an email.
 * 
 * Endpoint: GET /check-email
 * Query Params: { email: string }
 * Response: { available: boolean }
 */
auth.get("/check-email", async (c) => {
  // Get the email from query parameters
  const email = c.req.query("email");

  // Check if the email exists in the database
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email as string))
    .limit(1);

  // Return the availability status
  if (user.length) {
    return c.json({ available: false });
  } else {
    return c.json({ available: true });
  }
});

/**
 * Initiates a password reset process.
 * 
 * Endpoint: POST /forgot-password
 * Request Body: { email: string }
 * Response: { message: string }
 */
auth.post("/forgot-password", async (c) => {
  // Parse the request body
  const { email } = await c.req.json() as { email: string };

  // Check if the user exists in the database
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email as string))
    .limit(1);

  // If the user does not exist, send a generic response
  if (!user.length) {
    return c.json({ message: "If an account with that email exists, password reset instructions have been sent." });
  }

  // Generate a password reset token (expires in 15 minutes)
  const resetToken = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

  // In a real application, you would send the resetToken via email to the user.
  console.log(`Password reset token for ${email}: ${resetToken}`);

  return c.json({ message: "If an account with that email exists, password reset instructions have been sent." });
});


/**
 * Resets the user's password.
 * 
 * Endpoint: POST /reset-password
 * Request Body: { token: string, newPassword: string }
 * Response: { message: string } | { error: string }
 */
auth.post("/reset-password", async (c) => {
  // Parse the request body
  const { token, newPassword } = await c.req.json() as { token: string, newPassword: string };

  // Verify the reset token
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return c.json({ error: "Invalid or expired token" }, 400);
  }


  // Extract the user ID from the token payload
  const userId = (payload as any).id;

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the password for the user in the database
  await db.update(userTable)
    .set({ passwordHash: hashedPassword })
    .where(eq(userTable.id, userId));

  return c.json({ message: "Password reset successfully" });
});

export default auth;
