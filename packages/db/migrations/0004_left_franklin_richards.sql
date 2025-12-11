ALTER TABLE "to-do" RENAME TO "todos";--> statement-breakpoint
ALTER TABLE "todos" DROP CONSTRAINT "to-do_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "todos" DROP CONSTRAINT "to-do_status_id_statuses_id_fk";
--> statement-breakpoint
ALTER TABLE "statuses" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;