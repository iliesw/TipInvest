import { Hono } from "hono";
import { db } from "../Database/index";
import { userTable, expertProfileTable } from "../Database/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { GetVersion } from "../../lib";
import { sendVerificationEmail, sendConfirmationEmail, sendResetPasswordEmail } from "../utils/emailService";
import { randomBytes } from "crypto";

const auth = new Hono();

auth.get("/", (c) => c.json({ status: "Auth alive "+GetVersion() }));

/**
 * Registers a new user.
 * 
 * Endpoint: POST /register
 * Request Body: { name: string, email: string, password: string, phone?: string }
 * Response: { message: string } | { error: string }
 */
auth.post("/register", async (c) => {
  try {
    // Parse the request body
    const { name, email, password, phone, role, expertProfile } = await c.req.json() as { 
      name: string, 
      email: string, 
      password: string,
      phone?: string,
      role?: 'client' | 'agency' | 'expert',
      expertProfile?: {
        specialization: string,
        bio: string,
        hourlyRate: number
      }
    };

    // Validate required fields
    if (!name || !email || !password) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if user with this email already exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ error: "USER_EXISTS" }, 409);
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = randomBytes(32).toString("hex");
    console.log(role)
    // Insert new user into the database
    await db.insert(userTable).values({
      name: name,
      email: email,
      passwordHash: hashedPassword,
      phone: phone || null,
      role: role,
      verificationToken,
      isEmailVerified: false
    });
    // Get the newly created user
    const newUser = (await db.select().from(userTable).where(eq(userTable.email, email)).limit(1))[0];
    
    // If the user is registering as an expert, create an expert profile
    if (role === 'expert') {
      await db.insert(expertProfileTable).values({
        userId: newUser.id,
        specialization: expertProfile?.specialization || '',
        bio: expertProfile?.bio || '',
        hourlyRate: expertProfile?.hourlyRate?.toString() || '0',
        availability: {
          monday: Array(24).fill(false),
          tuesday: Array(24).fill(false),
          wednesday: Array(24).fill(false),
          thursday: Array(24).fill(false),
          friday: Array(24).fill(false),
          saturday: Array(24).fill(false),
          sunday: Array(24).fill(false),
        }
      });
    }

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken);

    return c.json({ message: "Registration successful. Please check your email to verify your account." });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Server error during registration" }, 500);
  }
});

/**
 * Logs in an existing user.
 * 
 * Endpoint: POST /login
 * Request Body: { email: string, password: string }
 * Response: { token: string, user: { id, name, email, role } } | { error: string }
 */
auth.post("/login", async (c) => {
  const { email, password } = await c.req.json() as { email: string, password: string };
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email as string))
    .limit(1);
  if (!user.length || !(await bcrypt.compare(password, user[0].passwordHash))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  if (!user[0].isEmailVerified) {
    return c.json({ error: "EMAIL_NOT_VERIFIED" }, 403);
  }
  const token = jwt.sign(
    { id: user[0].id, role: user[0].role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d"}
  );
  return c.json({
    token,
    user: {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      role: user[0].role
    }
  });
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
auth.get("/forgot-password", async (c) => {
  // Parse the request body
  const email = c.req.query("email")

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

  sendResetPasswordEmail(user[0].email, user[0].name, resetToken);
  
  // In a real application, you would send the resetToken via email to the user.
  // console.log(`Password reset token for ${email}: ${resetToken}`);

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

/**
 * Email verification endpoint
 * Verifies a user's email address using the verification token.
 * Endpoint: GET /verify-email?token=...
 */
auth.get("/verify-email", async (c) => {
  const token = c.req.query("token");
  if (!token) {
    return c.json({ error: "Missing verification token" }, 400);
  }
  const user = await db.select().from(userTable).where(eq(userTable.verificationToken, token)).limit(1);
  if (!user.length) {
    return c.json({ error: "Invalid or expired verification token" }, 400);
  }
  await db.update(userTable)
    .set({ isEmailVerified: true, verificationToken: null })
    .where(eq(userTable.id, user[0].id));
  await sendConfirmationEmail(user[0].email, user[0].name);
  return c.json({ message: "Email verified successfully. You can now log in." });
});

/**
 * Gets the account type from a token.
 * Endpoint: GET /accountType
 * Query Params: { token: string }
 * Response: { accountType: string }
 */
auth.get("/accountType", async (c) => {
  const token = c.req.query("token");
  if (!token) {
    return c.json({ error: "Missing token" }, 400);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    return c.json({ accountType: payload.role });
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default auth;
