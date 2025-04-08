import { Hono } from "hono";
import { db } from "../../Database/index";
import { expertProfileTable } from "../../Database/schema";
import { eq } from "drizzle-orm";

const getProfilePicture = new Hono();

/**
 * Get expert profile picture
 * 
 * Endpoint: GET /expert/profile/picture/:id
 * Response: Image binary data | { error: string }
 */
getProfilePicture.get("/:id", async (c) => {
  try {
    const expertId = c.req.param("id");

    // Find the expert profile in the database
    const expertProfile = await db
      .select({
        profilePicture: expertProfileTable.profilePicture
      })
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, expertId))
      .limit(1);

    if (!expertProfile.length || !expertProfile[0].profilePicture) {
      return c.json({ error: "Profile picture not found" }, 404);
    }

    // Convert base64 string back to buffer
    const imageBuffer = Buffer.from(expertProfile[0].profilePicture, 'base64');

    // Set appropriate headers for image response
    c.header("Content-Type", "image/jpeg");
    c.header("Cache-Control", "public, max-age=31536000");

    // Return the image data
    return c.body(imageBuffer);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return c.json({ error: "Server error while fetching profile picture" }, 500);
  }
});

export default getProfilePicture;