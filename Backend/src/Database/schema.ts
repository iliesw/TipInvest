import { pgTable, uuid, varchar, text, json, timestamp, decimal, pgEnum, numeric, boolean } from "drizzle-orm/pg-core";
import { view } from "drizzle-orm/sqlite-core";

export const roleEnum = pgEnum("role", ["user", "admin", "agency"]);
export const statusEnum = pgEnum("status", ["available", "sold","pending"]);

export const userTable = pgTable("USER", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("user"),
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

export const pageViews = pgTable("Views", {
  page: text("page").notNull(),
  views: numeric("views").default('0'),
})