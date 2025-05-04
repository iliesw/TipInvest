import { isNotNull } from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";
import { pgTable, uuid, varchar, text, json, timestamp, decimal, pgEnum, numeric, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["client", "admin", "agency", "expert"]);
export const statusEnum = pgEnum("status", ["available", "sold","pending"]);
export const meetingStatusEnum = pgEnum("meeting_status", ["scheduled", "completed", "cancelled"]);

export const userTable = pgTable("USER", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("client"),
  isEmailVerified: boolean("is_email_verified").default(false),
  verificationToken: varchar("verification_token", { length: 255 }),
  createdAt: timestamp("created_at",{ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at",{ mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()),
});

export const realestateTable = pgTable("REALESTATE", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => userTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  details: json("details").notNull(),
  status: statusEnum("status").default("available"),
  createdAt: timestamp("created_at",{ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at",{ mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()),
  views: numeric("views").default('0'),
});

export const transactionTable = pgTable("TRANSACTIONS", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => userTable.id),
  action: text("action").notNull(),
  amount: decimal("amount").notNull(),
  transactionDate: timestamp("transaction_date").defaultNow(),
});


export const imagesTable = pgTable("IMAGES", {
  id: uuid("id").defaultRandom().primaryKey(),
  realestateId: uuid("realestate_id").notNull(),
  imageData: text("image_data").notNull(),
})

export const CommentsTable = pgTable("Comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientID : uuid("user_id").notNull(),
  expertID : uuid("expert_id").notNull(),
  comment: text().notNull(),
  rating: numeric("rating").notNull(),
  date : timestamp().defaultNow()
})

export const pageViews = pgTable("Views", {
  page: text("page").notNull().primaryKey(),
  views: numeric("views").default('0'),
});

export const expertProfileTable = pgTable("EXPERT_PROFILE", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => userTable.id),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  hourlyRate: decimal("hourly_rate").notNull(),
  profilePicture: text("profile_picture"),
  availability: json("availability"),
  createdAt: timestamp("created_at", { mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()),
});

export const meetingTable = pgTable("MEETING", {
  id: uuid("id").defaultRandom().primaryKey(),
  expertId: uuid("expert_id").notNull().references(() => expertProfileTable.id),
  clientId: uuid("client_id").notNull().references(() => userTable.id),
  scheduledTime: timestamp("scheduled_time", { mode: 'date', precision: 3 }).notNull(),
  duration: numeric("duration").notNull(), // in minutes
  status: meetingStatusEnum("status").default("scheduled"),
  topic: varchar("topic", { length: 255 }),
  createdAt: timestamp("created_at", { mode: 'date', precision: 3 }).defaultNow(),
})