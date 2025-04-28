CREATE TYPE "public"."meeting_status" AS ENUM('scheduled', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('client', 'admin', 'agency', 'expert');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('available', 'sold', 'pending');--> statement-breakpoint
CREATE TABLE "EXPERT_PROFILE" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"specialization" varchar(255) NOT NULL,
	"bio" text NOT NULL,
	"hourly_rate" numeric NOT NULL,
	"profile_picture" text,
	"availability" json,
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "IMAGES" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"realestate_id" uuid NOT NULL,
	"image_data" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "MEETING" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expert_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"scheduled_time" timestamp (3) NOT NULL,
	"duration" numeric NOT NULL,
	"status" "meeting_status" DEFAULT 'scheduled',
	"topic" varchar(255),
	"notes" text,
	"meeting_link" varchar(255),
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Views" (
	"page" text NOT NULL,
	"views" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "REALESTATE" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"details" json NOT NULL,
	"status" "status" DEFAULT 'available',
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3) DEFAULT now(),
	"views" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "TRANSACTIONS" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"amount" numeric NOT NULL,
	"transaction_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "USER" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'client',
	"is_email_verified" boolean DEFAULT false,
	"verification_token" varchar(255),
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3) DEFAULT now(),
	CONSTRAINT "USER_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "EXPERT_PROFILE" ADD CONSTRAINT "EXPERT_PROFILE_user_id_USER_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."USER"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MEETING" ADD CONSTRAINT "MEETING_expert_id_EXPERT_PROFILE_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."EXPERT_PROFILE"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MEETING" ADD CONSTRAINT "MEETING_client_id_USER_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."USER"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "REALESTATE" ADD CONSTRAINT "REALESTATE_owner_id_USER_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."USER"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TRANSACTIONS" ADD CONSTRAINT "TRANSACTIONS_user_id_USER_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."USER"("id") ON DELETE no action ON UPDATE no action;