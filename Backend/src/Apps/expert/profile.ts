import { Hono } from "hono";
import { db } from "../../Database/index";
import { expertProfileTable, userTable } from "../../Database/schema";
import { eq } from "drizzle-orm";

const profile = new Hono();

/**
 * Get the expert profile for the authenticated user
 * 
 * Endpoint: GET /
 * Response: { profile: ExpertProfile } | { error: string }
 */
profile.get("/", async (c) => {
  try {
    const { id } = c.get("jwtPayload");

    // Find the expert profile in the database
    const expertProfile = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, id))
      .limit(1);

    if (!expertProfile.length) {
      return c.json({ error: "Expert profile not found" }, 404);
    }

    return c.json({ profile: expertProfile[0] });
  } catch (error) {
    console.error("Error fetching expert profile:", error);
    return c.json({ error: "Server error while fetching profile" }, 500);
  }
});

/**
 * Create or update the expert profile for the authenticated user
 * 
 * Endpoint: POST /
 * Request Body: { specialization: string, bio: string, hourlyRate: number, availability: object }
 * Response: { profile: ExpertProfile } | { error: string }
 */
profile.post("/", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
    const { specialization, bio, hourlyRate, availability, profilePicture } = await c.req.json();

    // Validate required fields
    if (!specialization || !bio || !hourlyRate) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if expert profile already exists
    const existingProfile = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, id))
      .limit(1);

    let profile;

    if (existingProfile.length > 0) {
      // Update existing profile
      await db
        .update(expertProfileTable)
        .set({
          specialization,
          bio,
          hourlyRate,
          availability: availability || existingProfile[0].availability,
          profilePicture: profilePicture || existingProfile[0].profilePicture,
          updatedAt: new Date(),
        })
        .where(eq(expertProfileTable.userId, id));

      // Get the updated profile
      profile = (await db
        .select()
        .from(expertProfileTable)
        .where(eq(expertProfileTable.userId, id))
        .limit(1))[0];
    } else {
      // Create new profile
      await db.insert(expertProfileTable).values({
        userId: id,
        specialization,
        bio,
        hourlyRate,
        profilePicture,
        availability: availability || {
          monday: Array(24).fill(false),
          tuesday: Array(24).fill(false),
          wednesday: Array(24).fill(false),
          thursday: Array(24).fill(false),
          friday: Array(24).fill(false),
          saturday: Array(24).fill(false),
          sunday: Array(24).fill(false),
        },
      });

      // Get the newly created profile
      profile = (await db
        .select()
        .from(expertProfileTable)
        .where(eq(expertProfileTable.userId, id))
        .limit(1))[0];
    }

    return c.json({ profile });
  } catch (error) {
    console.error("Error updating expert profile:", error);
    return c.json({ error: "Server error while updating profile" }, 500);
  }
});

/**
 * Update the expert's availability
 * 
 * Endpoint: PUT /availability
 * Request Body: { availability: object }
 * Response: { profile: ExpertProfile } | { error: string }
 */
profile.put("/availability", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
    const { availability } = await c.req.json();

    if (!availability) {
      return c.json({ error: "Availability data is required" }, 400);
    }

    // Check if expert profile exists
    const existingProfile = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, id))
      .limit(1);

    if (!existingProfile.length) {
      return c.json({ error: "Expert profile not found" }, 404);
    }

    // Update availability
    await db
      .update(expertProfileTable)
      .set({
        availability,
        updatedAt: new Date(),
      })
      .where(eq(expertProfileTable.userId, id));

    // Get the updated profile
    const updatedProfile = (await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, id))
      .limit(1))[0];

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating availability:", error);
    return c.json({ error: "Server error while updating availability" }, 500);
  }
});

export default profile;