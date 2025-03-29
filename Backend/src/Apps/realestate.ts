import { Hono } from "hono";
import { db } from "../Database";
import { imagesTable, realestateTable } from "../Database/schema";
import { eq } from "drizzle-orm";

const realEstate = new Hono();

realEstate.get("/", async (c) => {
  const listings = await db.select().from(realestateTable);
  const listingsWithImages = await Promise.all(
    listings.map(async (listing) => {
      const images = await db
        .select()
        .from(imagesTable)
        .where(eq(imagesTable.realestateId, listing.id))
        .limit(1);
      return { ...listing, images: images.length ? [images[0].imageData] : [] };
    })
  );
  return c.json(listingsWithImages);
});

realEstate.get("/:id", async (c) => {
  const id = c.req.param("id");
  const listing = await db
    .select()
    .from(realestateTable)
    .where(eq(realestateTable.id, id));
  if (!listing.length) return c.json({ error: "Listing not found" }, 404);

  const images = await db
    .select()
    .from(imagesTable)
    .where(eq(imagesTable.realestateId, id));

  return c.json({ ...listing[0], images: images.map((img) => img.imageData) });
});

export default realEstate;