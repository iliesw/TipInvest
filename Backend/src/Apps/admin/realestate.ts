import { Hono } from "hono";
import { db } from "../../Database/index";
import { imagesTable, realestateTable } from "../../Database/schema";
import { eq } from "drizzle-orm";
import { adminAuth } from "../../Middleware/auth";
import sharp = require("sharp");

const adminRealEstate = new Hono();

adminRealEstate.use("*", adminAuth);

adminRealEstate.get("/", async (c) => {
  const listings = await db.select().from(realestateTable);
  return c.json(listings);
});

adminRealEstate.get("/:id", async (c) => {
  const id = c.req.param("id");
  const listing = await db
    .select()
    .from(realestateTable)
    .where(eq(realestateTable.id, id));
  if (!listing.length) return c.json({ error: "Listing not found" }, 404);
  return c.json(listing[0]);
});

adminRealEstate.patch("/:id/status", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();

  if (!["available", "sold"].includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  await db
    .update(realestateTable)
    .set({ status })
    .where(eq(realestateTable.id, id));
  return c.json({ message: "Status updated successfully" });
});

adminRealEstate.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(realestateTable).where(eq(realestateTable.id, id));
  return c.json({ message: "Listing deleted" });
});

adminRealEstate.post("/", async (c) => {
  try {
    // Get admin user from context (set by adminAuth middleware)
    // @ts-ignore
    const admin = c.get("admin") as { id: string } | undefined;

    if (!admin) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Parse request body
    const { title, description, details } = await c.req.json();

    // Validate required fields
    if (!title || !description || !details) {
      return c.json(
        {
          error:
            "Missing required fields: title, description, and details are required",
        },
        400
      );
    }
    // Generate unique ID for property
    const propertyId = crypto.randomUUID();


    const Images = details.images as string[];
    // Validate images
    if (!Images || Images.length === 0) {
      return c.json({ error: "At least one image is required" }, 400);
    }
    // Upload images
    // Process images in parallel and store their IDs
    const imageIds = await Promise.all(
      Images.map((image) => uploadImage({ Data: image, RealestateID: propertyId }))
    );
    
    // Add image IDs to details
    details.images = imageIds;
    
    // Insert new property into database
    const newProperty = await db
      .insert(realestateTable)
      .values({
        id: propertyId,
        ownerId: admin.id,
        title,
        description,
        details,
        status: "available",
      })
      .returning();

    return c.json(
      { message: "Property created successfully", property: newProperty[0] },
      201
    );
  } catch (error) {
    console.error("Error creating property:", error);
    return c.json({ error: "Failed to create property" }, 500);
  }
});

adminRealEstate.get("/image/:id", async (c) => {
  const id = c.req.param("id");
  const image = await db
    .select()
    .from(imagesTable)
    .where(eq(imagesTable.id, id));

  if (!image.length) {
    return c.json({ error: "Image not found" }, 404);
  }
  console.log("Resquest received");
  return c.json({ imageData: image[0].imageData });
})

const uploadImage = async ({
  Data,
  RealestateID,
}: {
  Data: string;
  RealestateID: string;
}) => {
  const base64HeaderRegex = /^data:image\/(png|jpeg|jpg|webp);base64,/;
  Data = Data.replace(base64HeaderRegex, "");
  const imageBuffer = Buffer.from(Data, "base64");

  // Compress the image
  const compressedBuffer = await sharp(imageBuffer)
    .resize(1000) 
    .jpeg({ quality: 85 }) 
    .toBuffer();

  const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString(
    "base64"
  )}`;
  // generate unique id for image
  const imageId = crypto.randomUUID();
  
  // Save to database
  await db
    .insert(imagesTable)
    .values({
      id: imageId,
      realestateId: RealestateID,
      imageData: compressedBase64, // Store base64 string
    })
    .returning();
  return imageId
    
};

export default adminRealEstate;
