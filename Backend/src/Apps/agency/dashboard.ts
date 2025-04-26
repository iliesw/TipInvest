import { Hono } from "hono";
import { db } from "../../Database";
import { realestateTable } from "../../Database/schema";
import { eq } from "drizzle-orm";
import { agencyAuth } from "../../Middleware/agencyAuth";
import { cors } from "hono/cors";

const agencyDashboard = new Hono();
agencyDashboard.use('*', cors({ origin: '*' }));
// Apply agency authentication middleware to all routes
agencyDashboard.use("*", agencyAuth);

/**
 * Get dashboard statistics for the agency
 */
agencyDashboard.get("/stats", async (c) => {
  try {
    const agency = c.get("agency");
    
    // Get all properties owned by this agency
    const properties = await db
      .select()
      .from(realestateTable)
      .where(eq(realestateTable.ownerId, agency.id));
    
    // Calculate statistics
    const totalProperties = properties.length;
    const availableProperties = properties.filter(p => p.status === "available").length;
    const pendingProperties = properties.filter(p => p.status === "pending").length;
    const soldProperties = properties.filter(p => p.status === "sold").length;
    
    return c.json({
      totalProperties,
      availableProperties,
      pendingProperties,
      soldProperties
    });
  } catch (error) {
    console.error("Error fetching agency dashboard stats:", error);
    return c.json({ error: "Failed to fetch dashboard statistics" }, 500);
  }
});

/**
 * Get recent properties for the agency dashboard
 */
agencyDashboard.get("/recent", async (c) => {
  try {
    const agency = c.get("agency");
    
    // Get recent properties owned by this agency (limit to 5)
    const recentProperties = await db
      .select()
      .from(realestateTable)
      .where(eq(realestateTable.ownerId, agency.id))
      .orderBy(realestateTable.createdAt, "desc")
      .limit(5);
    
    return c.json(recentProperties);
  } catch (error) {
    console.error("Error fetching recent properties:", error);
    return c.json({ error: "Failed to fetch recent properties" }, 500);
  }
});

export default agencyDashboard;