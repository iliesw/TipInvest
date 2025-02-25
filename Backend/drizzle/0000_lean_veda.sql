CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('available', 'sold');--> statement-breakpoint
CREATE TABLE "REALESTATE" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"details" json NOT NULL,
	"status" "status" DEFAULT 'available',
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3) DEFAULT now()
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
	"role" "role" DEFAULT 'user',
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3) DEFAULT now(),
	CONSTRAINT "USER_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "REALESTATE" ADD CONSTRAINT "REALESTATE_owner_id_USER_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."USER"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TRANSACTIONS" ADD CONSTRAINT "TRANSACTIONS_user_id_USER_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."USER"("id") ON DELETE no action ON UPDATE no action;