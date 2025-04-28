import { Hono } from "hono";
import { db } from "../Database";
import { imagesTable, pageViews, realestateTable, userTable } from "../Database/schema";
import { eq } from "drizzle-orm";

const realEstate = new Hono();

realEstate.get("/", async (c) => {
  const listings = await db.select().from(realestateTable)
    .where(eq(realestateTable.status, "available"));
  const listingsWithImages = await Promise.all(
    listings.map(async (listing) => {
      // Get property images
      const images = await db
        .select()
        .from(imagesTable)
        .where(eq(imagesTable.realestateId, listing.id))
        .limit(1);
      
      // Get agency information
      const agency = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email
        })
        .from(userTable)
        .where(eq(userTable.id, listing.ownerId));
      
      return { 
        ...listing, 
        images: images.length ? [images[0].imageData] : [],
        agency: agency.length ? agency[0] : null
      };
    })
  );
  const pag_view = await db.select().from(pageViews)
    .where(eq(pageViews.page, "Market"));
  
  if (pag_view.length > 0) {
    // Increment views
    await db.update(pageViews)
      .set({ views: String(parseInt(pag_view[0].views || "0") + 1) })
      .where(eq(pageViews.page, "Market"));
  }

  return c.json(listingsWithImages);
});

realEstate.get("/:id", async (c) => {
  const id = c.req.param("id");
  const listing = await db
    .select()
    .from(realestateTable)
    .where(eq(realestateTable.id, id));
  if (!listing.length) return c.json({ error: "Listing not found" }, 404);


    
  // Get agency information
  const agency = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email
    })
    .from(userTable)
    .where(eq(userTable.id, listing[0].ownerId));

  // Increment views
   await db
   .update(realestateTable)
   .set({ views: String(parseInt(listing[0].views || "0") + 1) })
   .where(eq(realestateTable.id, id));

  return c.json({ 
    ...listing[0], 
    agency: agency.length ? agency[0] : null
  });
});

export default realEstate;