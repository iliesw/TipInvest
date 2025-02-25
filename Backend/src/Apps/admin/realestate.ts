import { Hono } from "hono";
import { db } from "../../Database/index";
import { realestateTable } from "../../Database/schema";
import { eq } from "drizzle-orm";
import { adminAuth } from "../../Middleware/auth";

const adminRealEstate = new Hono();

adminRealEstate.use("*", adminAuth);

adminRealEstate.get("/", async (c) => {
  const listings = await db.select().from(realestateTable);
  return c.json(listings);
});

adminRealEstate.get("/:id", async (c) => {
  const id = c.req.param("id");
  const listing = await db.select().from(realestateTable).where(eq(realestateTable.id, id));
  if (!listing.length) return c.json({ error: "Listing not found" }, 404);
  return c.json(listing[0]);
});

adminRealEstate.patch("/:id/status", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();

  if (!["available", "sold"].includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  await db.update(realestateTable).set({ status }).where(eq(realestateTable.id, id));
  return c.json({ message: "Status updated successfully" });
});

adminRealEstate.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(realestateTable).where(eq(realestateTable.id, id));
  return c.json({ message: "Listing deleted" });
});

export default adminRealEstate;
