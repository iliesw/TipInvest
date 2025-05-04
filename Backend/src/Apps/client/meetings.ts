import { Hono } from "hono";
import { db } from "../../Database/index";
import { meetingTable, expertProfileTable, userTable, CommentsTable } from "../../Database/schema";
import { eq, and, gte } from "drizzle-orm";

const meetings = new Hono();

/**
 * Get all upcoming meetings for the client
 * 
 * Endpoint: GET /
 * Response: { meetings: Meeting[] } | { error: string }
 */
meetings.get("/", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
console.log(id);
    // TODO: Implement pagination and filtering if needed
    // TOD
    // Get current date for filtering upcoming meetings
    const now = new Date();

    // Find all upcoming meetings for this client
    const meetings = await db
      .select({
        id: meetingTable.id,
        scheduledTime: meetingTable.scheduledTime,
        duration: meetingTable.duration,
        status: meetingTable.status,
        topic: meetingTable.topic,
        expertId: meetingTable.expertId,
      })
      .from(meetingTable)
      .where(
          eq(meetingTable.clientId, id),
      )
      .orderBy(meetingTable.scheduledTime);

    // Get expert details for each meeting
    const meetingsWithExpertDetails = await Promise.all(
      meetings.map(async (meeting) => {
        // Get expert profile
        const expertProfile = await db
          .select()
          .from(expertProfileTable)
          .where(eq(expertProfileTable.id, meeting.expertId))
          .limit(1);

        if (!expertProfile.length) {
          return { ...meeting, expert: null };
        }

        // Get expert user details
        const expertUser = await db
          .select({
            id: userTable.id,
            name: userTable.name,
            email: userTable.email,
          })
          .from(userTable)
          .where(eq(userTable.id, expertProfile[0].userId))
          .limit(1);

        return {
          ...meeting,
          expert: {
            ...expertProfile[0],
            name: expertUser[0]?.name || "Unknown Expert",
          },
        };
      })
    );

    return c.json({ meetings: meetingsWithExpertDetails });
  } catch (error) {
    console.error("Error fetching client meetings:", error);
    return c.json({ error: "Server error while fetching meetings" }, 500);
  }
});

/**
 * Get a specific meeting by ID
 * 
 * Endpoint: GET /:id
 * Response: { meeting: Meeting } | { error: string }
 */
meetings.get("/:id", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
    const meetingId = c.req.param("id");

    // Find the meeting
    const meeting = await db
      .select()
      .from(meetingTable)
      .where(
        and(
          eq(meetingTable.id, meetingId),
          eq(meetingTable.clientId, id)
        )
      )
      .limit(1);

    if (!meeting.length) {
      return c.json({ error: "Meeting not found" }, 404);
    }

    // Get expert profile
    const expertProfile = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.id, meeting[0].expertId))
      .limit(1);

    // Get expert user details
    const expertUser = expertProfile.length ? await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
      })
      .from(userTable)
      .where(eq(userTable.id, expertProfile[0].userId))
      .limit(1) : [];

    return c.json({
      meeting: {
        ...meeting[0],
        expert: expertProfile.length ? {
          ...expertProfile[0],
          name: expertUser[0]?.name || "Unknown Expert",
        } : null,
      },
    });
  } catch (error) {
    console.error("Error fetching meeting details:", error);
    return c.json({ error: "Server error while fetching meeting details" }, 500);
  }
});

/**
 * Book a meeting with an expert
 * 
 * Endpoint: POST /
 * Request Body: { expertId: string, scheduledTime: string, duration: number, topic: string }
 * Response: { meeting: Meeting } | { error: string }
 */
meetings.post("/", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
    const { expertId, scheduledTime, duration, topic } = await c.req.json();

    // Validate required fields
    if (!expertId || !scheduledTime || !duration || !topic) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if expert exists
    const expert = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.id, expertId))
      .limit(1);

    if (!expert.length) {
      return c.json({ error: "Expert not found" }, 404);
    }

    // Create the meeting
    await db.insert(meetingTable).values({
      expertId,
      clientId: id,
      scheduledTime: new Date(scheduledTime),
      duration,
      topic,
      status: "scheduled",
    });

    // Get the newly created meeting
    const newMeeting = await db
      .select()
      .from(meetingTable)
      .where(
        and(
          eq(meetingTable.expertId, expertId),
          eq(meetingTable.clientId, id),
          eq(meetingTable.scheduledTime, new Date(scheduledTime))
        )
      )
      .limit(1);

    return c.json({ meeting: newMeeting[0] });
  } catch (error) {
    console.error("Error booking meeting:", error);
    return c.json({ error: "Server error while booking meeting" }, 500);
  }
});

/**
 * Cancel a meeting
 * 
 * Endpoint: PUT /:id/cancel
 * Response: { success: boolean } | { error: string }
 */
meetings.put("/:id/cancel", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
    const meetingId = c.req.param("id");

    // Find the meeting
    const meeting = await db
      .select()
      .from(meetingTable)
      .where(
        and(
          eq(meetingTable.id, meetingId),
          eq(meetingTable.clientId, id)
        )
      )
      .limit(1);

    if (!meeting.length) {
      return c.json({ error: "Meeting not found" }, 404);
    }

    // Check if meeting can be cancelled (not in the past and not already cancelled)
    const now = new Date();
    if (new Date(meeting[0].scheduledTime) < now) {
      return c.json({ error: "Cannot cancel a past meeting" }, 400);
    }

    if (meeting[0].status === "cancelled") {
      return c.json({ error: "Meeting is already cancelled" }, 400);
    }

    // Update the meeting status
    await db
      .update(meetingTable)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(meetingTable.id, meetingId));

    return c.json({ success: true });
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    return c.json({ error: "Server error while cancelling meeting" }, 500);
  }
});


meetings.post("/rate", async (c) => {
  const { id,rating,review } = await c.req.json();
  // Find the meeting
  const meeting = await db
   .select()
   .from(meetingTable)
   .where(eq(meetingTable.id, id))
   .limit(1);

  if (!meeting.length) {
    return c.json({ error: "Meeting not found" }, 404);
  }
  // Update the meeting status
  await db
  .update(meetingTable)
  .set({
    status: "completed",
  })

  await db.insert(CommentsTable).values({
    id: id,
    expertID: meeting[0].expertId,
    clientID: meeting[0].clientId,
    comment: review,
    rating: rating,
  });

  return c.json({ status: true });

})

export default meetings;