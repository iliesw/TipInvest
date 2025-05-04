import { Hono } from "hono";
import { db } from "../../Database/index";
import { expertProfileTable, userTable, CommentsTable, meetingTable } from "../../Database/schema";
import { eq, avg, count } from "drizzle-orm";

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
 * Response: { expert: ExpertProfile & { user: User, reviews: Review[], rating: number } } | { error: string }
 */
experts.get("/:id", async (c) => {
  try {
    const expertId = c.req.param("id");

    // Fetch the expert profile with user information
    const expertWithProfile = await db
      .select()
      .from(expertProfileTable)
      .leftJoin(userTable, eq(expertProfileTable.userId, userTable.id))
      .where(eq(expertProfileTable.id, expertId));

    if (!expertWithProfile.length) {
      return c.json({ error: "Expert not found" }, 404);
    }

    const { EXPERT_PROFILE, USER } = expertWithProfile[0];

    // Fetch reviews for this expert
    const reviews = await db
      .select()
      .from(CommentsTable)
      .where(eq(CommentsTable.expertID, expertId));

    // Get client names for each review
    const reviewsWithClientNames = await Promise.all(
      reviews.map(async (review) => {
        const client = await db
          .select({
            name: userTable.name
          })
          .from(userTable)
          .where(eq(userTable.id, review.clientID))
          .limit(1);

        return {
          ...review,
          clientName: client.length ? client[0].name : "Anonymous"
        };
      })
    );

    // Calculate average rating
    const ratingResult = await db
      .select({ averageRating: avg(CommentsTable.rating) })
      .from(CommentsTable)
      .where(eq(CommentsTable.expertID, expertId));

    const averageRating = ratingResult[0]?.averageRating || 0;
    
    // Count completed meetings for this expert
    const completedMeetingsResult = await db
      .select({ count: count() })
      .from(meetingTable)
      .where(eq(meetingTable.expertId, expertId))
      .where(eq(meetingTable.status, "completed"));
      
    const completedMeetingsCount = completedMeetingsResult[0]?.count || 0;

    // Transform the data to include only necessary user information
    const expert = {
      ...EXPERT_PROFILE,
      name: USER.name,
      email: USER.email,
      avatar: USER.avatar,
      reviews: reviewsWithClientNames,
      rating: typeof averageRating === 'number' ? Number(averageRating.toFixed(1)) : 0,
      completedMeetingsCount: Number(completedMeetingsCount)
    };

    return c.json({ expert });
  } catch (error) {
    console.error("Error fetching expert:", error);
    return c.json({ error: "Server error while fetching expert" }, 500);
  }
});

export default experts;