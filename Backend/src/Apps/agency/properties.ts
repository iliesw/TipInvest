import { Hono } from "hono";
import { db } from "../../Database";
import { imagesTable, realestateTable } from "../../Database/schema";
import { eq, and } from "drizzle-orm";
import { agencyAuth } from "../../Middleware/agencyAuth";
import sharp = require("sharp");
import { cors } from "hono/cors";

const agencyProperties = new Hono();
agencyProperties.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  maxAge: 86400, // 24 hours cache for CORS preflight
  credentials: true,
}));

// Apply agency authentication middleware to all routes
agencyProperties.use("*", agencyAuth);

/**
 * Get all properties owned by the agency
 */
agencyProperties.get("/", async (c) => {
  c.header('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  try {
    const agency = c.get("agency");
    
    // Get all properties owned by this agency
    const properties = await db
      .select()
      .from(realestateTable)
      .where(eq(realestateTable.ownerId, agency.id));
    
    // Get images for each property
    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        const images = await db
          .select()
          .from(imagesTable)
          .where(eq(imagesTable.realestateId, property.id));
        
        return {
          ...property,
          images: images.map(img => img.imageData)
        };
      })
    );
    
    return c.json(propertiesWithImages);
  } catch (error) {
    console.error("Error fetching agency properties:", error);
    return c.json({ error: "Failed to fetch properties" }, 500);
  }
});

/**
 * Get a specific property by ID (only if owned by the agency)
 */
agencyProperties.get("/:id", async (c) => {
  c.header('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  try {
    const agency = c.get("agency");
    const propertyId = c.req.param("id");
    
    // Get the property if owned by this agency
    const property = await db
      .select()
      .from(realestateTable)
      .where(
        and(
          eq(realestateTable.id, propertyId),
          eq(realestateTable.ownerId, agency.id)
        )
      )
      .limit(1);
    
    if (!property.length) {
      return c.json({ error: "Property not found or not owned by this agency" }, 404);
    }
    
    // Get images for the property
    const images = await db
      .select()
      .from(imagesTable)
      .where(eq(imagesTable.realestateId, propertyId));
    
    return c.json({
      ...property[0],
      images: images.map(img => img.imageData)
    });
  } catch (error) {
    console.error("Error fetching property details:", error);
    return c.json({ error: "Failed to fetch property details" }, 500);
  }
});

/**
 * Create a new property
 */
agencyProperties.post("/", async (c) => {
  try {
    const agency = c.get("agency");
    const { title, description, details, status } = await c.req.json();
    
    // Validate required fields
    if (!title || !description || !details) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    // Generate unique ID for property
    const propertyId = crypto.randomUUID();
    
    // Process images if provided
    let imageIds = [];
    if (details.images && Array.isArray(details.images) && details.images.length > 0) {
      // Process images in parallel and store their IDs
      imageIds = await Promise.all(
        details.images.map((image) => uploadImage({ Data: image, RealestateID: propertyId }))
      );
      
      // Replace base64 images with image IDs in details
      details.images = imageIds;
    }
    
    // Create the property with the status from request or default to pending
    const [newProperty] = await db
      .insert(realestateTable)
      .values({
        id: propertyId,
        ownerId: agency.id,
        title,
        description,
        details,
        status: status || "pending" // Default to pending as specified in frontend
      })
      .returning();
    
    return c.json({
      message: "Property created successfully",
      property: newProperty
    }, 201);
  } catch (error) {
    console.error("Error creating property:", error);
    return c.json({ error: "Failed to create property" }, 500);
  }
});

/**
 * Helper function to process and upload an image
 */
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

  // Optimize image processing with better compression and caching
  const compressedBuffer = await sharp(imageBuffer)
    .resize(800, 600, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ 
      quality: 70,
      progressive: true,  // Better loading experience
      mozjpeg: true,     // Better compression
      optimizeScans: true // Further optimization
    })
    .toBuffer();

  const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
  const imageId = crypto.randomUUID();
  
  // Batch insert with better error handling
  try {
    await db
      .insert(imagesTable)
      .values({
        id: imageId,
        realestateId: RealestateID,
        imageData: compressedBase64,
      });
    return imageId;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Update an existing property
 */
agencyProperties.put("/:id", async (c) => {
  try {
    const agency = c.get("agency");
    const propertyId = c.req.param("id");
    const { title, description, details, status, images } = await c.req.json();
    
    // Check if property exists and is owned by this agency
    const existingProperty = await db
      .select()
      .from(realestateTable)
      .where(
        and(
          eq(realestateTable.id, propertyId),
          eq(realestateTable.ownerId, agency.id)
        )
      )
      .limit(1);
    
    if (!existingProperty.length) {
      return c.json({ error: "Property not found or not owned by this agency" }, 404);
    }
    
    // Process images if provided
    let updatedDetails = { ...details } || { ...existingProperty[0].details };
    
    if (images && Array.isArray(images) && images.length > 0) {
      // Delete existing images
      await db
        .delete(imagesTable)
        .where(eq(imagesTable.realestateId, propertyId));
      
      // Process and upload new images
      const imageIds = await Promise.all(
        images.map((image) => uploadImage({ Data: image, RealestateID: propertyId }))
      );
      
      // Update details with new image IDs
      updatedDetails.images = imageIds;
    }
    
    // Update the property
    const [updatedProperty] = await db
      .update(realestateTable)
      .set({
        title: title || existingProperty[0].title,
        description: description || existingProperty[0].description,
        details: updatedDetails,
        status: status || existingProperty[0].status,
        updatedAt: new Date()
      })
      .where(eq(realestateTable.id, propertyId))
      .returning();
    
    return c.json({
      message: "Property updated successfully",
      property: updatedProperty
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return c.json({ error: "Failed to update property" }, 500);
  }
});

/**
 * Delete a property
 */
agencyProperties.delete("/:id", async (c) => {
  try {
    const agency = c.get("agency");
    const propertyId = c.req.param("id");
    
    // Check if property exists and is owned by this agency
    const existingProperty = await db
      .select()
      .from(realestateTable)
      .where(
        and(
          eq(realestateTable.id, propertyId),
          eq(realestateTable.ownerId, agency.id)
        )
      )
      .limit(1);
    
    if (!existingProperty.length) {
      return c.json({ error: "Property not found or not owned by this agency" }, 404);
    }
    
    // Delete images first (foreign key constraint)
    await db
      .delete(imagesTable)
      .where(eq(imagesTable.realestateId, propertyId));
    
    // Delete the property
    await db
      .delete(realestateTable)
      .where(eq(realestateTable.id, propertyId));
    
    return c.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return c.json({ error: "Failed to delete property" }, 500);
  }
});

/**
 * Upload images for a property
 */
agencyProperties.post("/:id/images", async (c) => {
  try {
    const agency = c.get("agency");
    const propertyId = c.req.param("id");
    
    // Check if property exists and is owned by this agency
    const existingProperty = await db
      .select()
      .from(realestateTable)
      .where(
        and(
          eq(realestateTable.id, propertyId),
          eq(realestateTable.ownerId, agency.id)
        )
      )
      .limit(1);
    
    if (!existingProperty.length) {
      return c.json({ error: "Property not found or not owned by this agency" }, 404);
    }
    
    // Handle file uploads
    const formData = await c.req.formData();
    const imageFiles = formData.getAll("images");
    
    if (!imageFiles || imageFiles.length === 0) {
      return c.json({ error: "No images provided" }, 400);
    }
    
    // Process and save each image
    const savedImages = await Promise.all(
      imageFiles.map(async (file) => {
        if (!(file instanceof File)) {
          return null;
        }
        
        // Convert file to base64 string for storage
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Compress the image using sharp
        const compressedBuffer = await sharp(buffer)
          .resize(1000) 
          .jpeg({ quality: 85 }) 
          .toBuffer();

        const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
        
        // Generate unique ID for image
        const imageId = crypto.randomUUID();
        
        // Save image to database
        await db
          .insert(imagesTable)
          .values({
            id: imageId,
            realestateId: propertyId,
            imageData: compressedBase64
          })
          .returning();
        
        return imageId;
      })
    );
    
    // Filter out any null values from failed uploads
    const successfulUploads = savedImages.filter(id => id !== null);
    
    // Update property details to include image IDs
    const updatedDetails = { ...existingProperty[0].details };
    updatedDetails.images = successfulUploads;
    
    await db
      .update(realestateTable)
      .set({
        details: updatedDetails,
        updatedAt: new Date()
      })
      .where(eq(realestateTable.id, propertyId));
    
    return c.json({
      message: `Successfully uploaded ${successfulUploads.length} images`,
      imageIds: successfulUploads
    }, 201);
  } catch (error) {
    console.error("Error uploading property images:", error);
    return c.json({ error: "Failed to upload images" }, 500);
  }
});

/**
 * Get image by ID
 */
agencyProperties.get("/image/:id", async (c) => {
  c.header('Cache-Control', 'public, max-age=604800'); // 7 days cache for images
  try {
    const imageId = c.req.param("id");
    const image = await db
      .select()
      .from(imagesTable)
      .where(eq(imagesTable.id, imageId));

    if (!image.length) {
      return c.json({ error: "Image not found" }, 404);
    }
    
    return c.json({ imageData: image[0].imageData });
  } catch (error) {
    console.error("Error fetching image:", error);
    return c.json({ error: "Failed to fetch image" }, 500);
  }
});

export default agencyProperties;