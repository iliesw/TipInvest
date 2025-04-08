import { Hono } from "hono";
import { db } from "../../Database/index";
import { expertProfileTable, userTable } from "../../Database/schema";
import { eq } from "drizzle-orm";

const experts = new Hono();

/**
 * Get all experts with their profiles
 * 
 * Endpoint: GET /
 * Response: { experts: Array<ExpertProfile & { user: User }> } | { error: string }
 */
experts.get("/", async (c) => {
  try {
    // Fetch all expert profiles with their user information
    const expertsWithProfiles = await db
      .select()
      .from(expertProfileTable)
      .leftJoin(userTable, eq(expertProfileTable.userId, userTable.id));
      
    const experts = expertsWithProfiles.map(({ EXPERT_PROFILE, USER }) => ({
      ...EXPERT_PROFILE,
      user: USER ? {
        id: USER.id,
        name: USER.name,
        email: USER.email,
        // avatar: USER.avatar
      } : null
    }));

    return c.json({ experts });
  } catch (error) {
    console.error("Error fetching experts:", error);
    return c.json({ error: "Server error while fetching experts" }, 500);
  }
});

/**
 * Get a specific expert's profile by ID
 * 
 * Endpoint: GET /:id
 * Response: { expert: ExpertProfile & { user: User } } | { error: string }
 */
experts.get("/:id", async (c) => {
  try {
    const expertId = c.req.param("id");

    // Fetch the expert profile with user information
    const expertWithProfile = await db
      .select()
      .from(expertProfileTable)
     .leftJoin(userTable, eq(expertProfileTable.userId, userTable.id))
     

    console.log(expertWithProfile);

    if (!expertWithProfile.length) {
      return c.json({ error: "Expert not found" }, 404);
    }

    const { EXPERT_PROFILE, USER } = expertWithProfile[0];

    // Transform the data to include only necessary user information
    const expert = {
      ...EXPERT_PROFILE,
      name: USER.name,
      email: USER.email,
      avatar: USER.avatar
    };

    return c.json({ expert });
  } catch (error) {
    console.error("Error fetching expert:", error);
    return c.json({ error: "Server error while fetching expert" }, 500);
  }
});

export default experts;