ALTER TABLE "invitations" ADD COLUMN "token" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "expiredAt" timestamp;