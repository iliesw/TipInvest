import { Hono } from "hono";
import { db } from "../../Database/index";
import { CommentsTable, expertProfileTable, userTable } from "../../Database/schema";
import { eq, and } from "drizzle-orm";

const reviews = new Hono();

/**
 * Get all reviews for a specific expert
 * 
 * Endpoint: GET /:expertId
 * Response: { reviews: Array<Review & { clientName: string }> } | { error: string }
 */
reviews.get("/:expertId", async (c) => {
  try {
    const expertId = c.req.param("expertId");

    // Verify expert exists
    const expert = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.id, expertId))
      .limit(1);

    if (!expert.length) {
      return c.json({ error: "Expert not found" }, 404);
    }

    // Fetch all reviews for this expert
    const expertReviews = await db
      .select()
      .from(CommentsTable)
      .where(eq(CommentsTable.expertID, expertId));

    // Get client names for each review
    const reviewsWithClientNames = await Promise.all(
      expertReviews.map(async (review) => {
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

    return c.json({ reviews: reviewsWithClientNames });
  } catch (error) {
    console.error("Error fetching expert reviews:", error);
    return c.json({ error: "Server error while fetching reviews" }, 500);
  }
});

/**
 * Submit a review for an expert
 * 
 * Endpoint: POST /:expertId
 * Request Body: { rating: number, comment: string }
 * Response: { review: Review } | { error: string }
 */
reviews.post("/:expertId", async (c) => {
  try {
    const { id } = c.get("jwtPayload"); // Client ID from JWT
    const expertId = c.req.param("expertId");
    const { rating, comment } = await c.req.json();

    // Validate required fields
    if (!rating || !comment) {
      return c.json({ error: "Rating and comment are required" }, 400);
    }

    // Verify expert exists
    const expert = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.id, expertId))
      .limit(1);

    if (!expert.length) {
      return c.json({ error: "Expert not found" }, 404);
    }

    // Check if client has already reviewed this expert
    const existingReview = await db
      .select()
      .from(CommentsTable)
      .where(
        and(
          eq(CommentsTable.clientID, id),
          eq(CommentsTable.expertID, expertId)
        )
      )
      .limit(1);

    if (existingReview.length) {
      // Update existing review
      await db
        .update(CommentsTable)
        .set({
          rating,
          comment,
          date: new Date()
        })
        .where(
          and(
            eq(CommentsTable.clientID, id),
            eq(CommentsTable.expertID, expertId)
          )
        );

      const updatedReview = await db
        .select()
        .from(CommentsTable)
        .where(
          and(
            eq(CommentsTable.clientID, id),
            eq(CommentsTable.expertID, expertId)
          )
        )
        .limit(1);

      return c.json({ review: updatedReview[0] });
    } else {
      // Create new review
      await db.insert(CommentsTable).values({
        clientID: id,
        expertID: expertId,
        rating,
        comment
      });

      const newReview = await db
        .select()
        .from(CommentsTable)
        .where(
          and(
            eq(CommentsTable.clientID, id),
            eq(CommentsTable.expertID, expertId)
          )
        )
        .limit(1);

      return c.json({ review: newReview[0] });
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    return c.json({ error: "Server error while submitting review" }, 500);
  }
});

export default reviews;