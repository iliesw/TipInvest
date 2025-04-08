import { Hono } from "hono";
import { db } from "../../Database/index";
import { meetingTable, expertProfileTable, userTable } from "../../Database/schema";
import { eq, and, gte } from "drizzle-orm";

const meetings = new Hono();

/**
 * Get all upcoming meetings for the expert
 * 
 * Endpoint: GET /
 * Response: { meetings: Meeting[] } | { error: string }
 */
meetings.get("/", async (c) => {
  try {
    const { id } = c.get("jwtPayload");

    // Find the expert profile ID
    const expertProfile = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, id))
      .limit(1);

    if (!expertProfile.length) {
      return c.json({ error: "Expert profile not found" }, 404);
    }

    const expertId = expertProfile[0].id;

    // Get current date for filtering upcoming meetings
    const now = new Date();

    // Find all upcoming meetings for this expert
    const meetings = await db
      .select({
        id: meetingTable.id,
        scheduledTime: meetingTable.scheduledTime,
        duration: meetingTable.duration,
        status: meetingTable.status,
        topic: meetingTable.topic,
        meetingLink: meetingTable.meetingLink,
        clientId: meetingTable.clientId,
      })
      .from(meetingTable)
      .where(
        and(
          eq(meetingTable.expertId, expertId),
          gte(meetingTable.scheduledTime, now)
        )
      )
      .orderBy(meetingTable.scheduledTime);

    // Get client details for each meeting
    const meetingsWithClientDetails = await Promise.all(
      meetings.map(async (meeting) => {
        const client = await db
          .select({
            id: userTable.id,
            name: userTable.name,
            email: userTable.email,
          })
          .from(userTable)
          .where(eq(userTable.id, meeting.clientId))
          .limit(1);

        return {
          ...meeting,
          client: client[0] || null,
        };
      })
    );

    return c.json({ meetings: meetingsWithClientDetails });
  } catch (error) {
    console.error("Error fetching expert meetings:", error);
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

    // Find the expert profile ID
    const expertProfile = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, id))
      .limit(1);

    if (!expertProfile.length) {
      return c.json({ error: "Expert profile not found" }, 404);
    }

    const expertId = expertProfile[0].id;

    // Find the meeting
    const meeting = await db
      .select()
      .from(meetingTable)
      .where(
        and(
          eq(meetingTable.id, meetingId),
          eq(meetingTable.expertId, expertId)
        )
      )
      .limit(1);

    if (!meeting.length) {
      return c.json({ error: "Meeting not found" }, 404);
    }

    // Get client details
    const client = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
      })
      .from(userTable)
      .where(eq(userTable.id, meeting[0].clientId))
      .limit(1);

    return c.json({
      meeting: {
        ...meeting[0],
        client: client[0] || null,
      },
    });
  } catch (error) {
    console.error("Error fetching meeting details:", error);
    return c.json({ error: "Server error while fetching meeting details" }, 500);
  }
});

/**
 * Update meeting status (complete or cancel)
 * 
 * Endpoint: PUT /:id/status
 * Request Body: { status: 'completed' | 'cancelled', notes?: string }
 * Response: { meeting: Meeting } | { error: string }
 */
meetings.put("/:id/status", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
    const meetingId = c.req.param("id");
    const { status, notes } = await c.req.json();

    if (!status || !['completed', 'cancelled'].includes(status)) {
      return c.json({ error: "Invalid status value" }, 400);
    }

    // Find the expert profile ID
    const expertProfile = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, id))
      .limit(1);

    if (!expertProfile.length) {
      return c.json({ error: "Expert profile not found" }, 404);
    }

    const expertId = expertProfile[0].id;

    // Find the meeting
    const meeting = await db
      .select()
      .from(meetingTable)
      .where(
        and(
          eq(meetingTable.id, meetingId),
          eq(meetingTable.expertId, expertId)
        )
      )
      .limit(1);

    if (!meeting.length) {
      return c.json({ error: "Meeting not found" }, 404);
    }

    // Update the meeting status
    await db
      .update(meetingTable)
      .set({
        status,
        notes: notes || meeting[0].notes,
        updatedAt: new Date(),
      })
      .where(eq(meetingTable.id, meetingId));

    // Get the updated meeting
    const updatedMeeting = await db
      .select()
      .from(meetingTable)
      .where(eq(meetingTable.id, meetingId))
      .limit(1);

    return c.json({ meeting: updatedMeeting[0] });
  } catch (error) {
    console.error("Error updating meeting status:", error);
    return c.json({ error: "Server error while updating meeting status" }, 500);
  }
});

/**
 * Generate or update meeting link
 * 
 * Endpoint: PUT /:id/link
 * Response: { meetingLink: string } | { error: string }
 */
meetings.put("/:id/link", async (c) => {
  try {
    const { id } = c.get("jwtPayload");
    const meetingId = c.req.param("id");

    // Find the expert profile ID
    const expertProfile = await db
      .select()
      .from(expertProfileTable)
      .where(eq(expertProfileTable.userId, id))
      .limit(1);

    if (!expertProfile.length) {
      return c.json({ error: "Expert profile not found" }, 404);
    }

    const expertId = expertProfile[0].id;

    // Find the meeting
    const meeting = await db
      .select()
      .from(meetingTable)
      .where(
        and(
          eq(meetingTable.id, meetingId),
          eq(meetingTable.expertId, expertId)
        )
      )
      .limit(1);

    if (!meeting.length) {
      return c.json({ error: "Meeting not found" }, 404);
    }

    // Generate a unique meeting link (in a real app, this would integrate with a video service API)
    const meetingLink = `https://meet.tipinvest.com/${meetingId}`;

    // Update the meeting with the link
    await db
      .update(meetingTable)
      .set({
        meetingLink,
        updatedAt: new Date(),
      })
      .where(eq(meetingTable.id, meetingId));

    return c.json({ meetingLink });
  } catch (error) {
    console.error("Error generating meeting link:", error);
    return c.json({ error: "Server error while generating meeting link" }, 500);
  }
});

export default meetings;