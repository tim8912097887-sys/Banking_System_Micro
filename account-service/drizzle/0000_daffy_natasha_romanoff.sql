CREATE TYPE "public"."accountStatus" AS ENUM('active', 'frozen', 'closed');--> statement-breakpoint
CREATE TYPE "public"."accountType" AS ENUM('current', 'savings');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_name" text NOT NULL,
	"account_type" "accountType" DEFAULT 'savings' NOT NULL,
	"accountNumber" varchar(15),
	"account_status" "accountStatus" DEFAULT 'active' NOT NULL,
	"balance" numeric(10, 2) DEFAULT '0',
	"currency" varchar(3) DEFAULT 'TWD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone
);
