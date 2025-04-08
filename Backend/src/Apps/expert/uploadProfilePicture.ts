import { Hono } from "hono";
import { db } from "../../Database/index";
import { expertProfileTable } from "../../Database/schema";
import { eq } from "drizzle-orm";

const uploadProfilePicture = new Hono();

/**
 * Upload expert profile picture
 * 
 * Endpoint: POST /expert/profile/upload-picture
 * Request Body: JSON with 'image' field containing base64 string
 * Response: { profilePictureUrl: string } | { error: string }
 */
uploadProfilePicture.post("/", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
    const body = await c.req.json();
    const base64Image = JSON.parse(body.image).image;
    console.log(base64Image)

    console.log("Received image upload request with payload:", { userId: id, hasImage: !!base64Image });
    
    if (!base64Image) {
      console.error("Image upload failed: No base64Image provided in request body");
      return c.json({ error: "No profile picture provided" }, 400);
    }
    

    // Update expert profile with new profile picture as base64
    await db
      .update(expertProfileTable)
      .set({
        profilePicture: base64Image,
        updatedAt: new Date(),
      })
      .where(eq(expertProfileTable.userId, id));

    // Return the profilePictureUrl as expected by the frontend
    return c.json({ profilePictureUrl: `/expert/profile/picture/${id}` });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return c.json({ error: "Server error while uploading profile picture" }, 500);
  }
});

export default uploadProfilePicture;