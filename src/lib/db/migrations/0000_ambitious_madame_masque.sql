CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"discussion_id" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"project_id" text NOT NULL,
	"author_id" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journey_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"creator_id" text NOT NULL,
	"project_id" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"demo_url" text,
	"repo_url" text NOT NULL,
	"tech_stack" jsonb DEFAULT '[]' NOT NULL,
	"ai_tool_tags" jsonb DEFAULT '[]' NOT NULL,
	"creator_id" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supporters" (
	"id" text PRIMARY KEY NOT NULL,
	"supporter_id" text NOT NULL,
	"creator_id" text NOT NULL,
	"project_id" text NOT NULL,
	"tier" text NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"amount_paid" integer,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"supporter_id" text NOT NULL,
	"amount" integer NOT NULL,
	"tier" text NOT NULL,
	"payment_type" text NOT NULL,
	"razorpay_id" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_razorpay_id_unique" UNIQUE("razorpay_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"bio" text,
	"avatar" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "versions" (
	"id" text PRIMARY KEY NOT NULL,
	"version_number" text NOT NULL,
	"project_id" text NOT NULL,
	"release_notes" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"released_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_posts" ADD CONSTRAINT "journey_posts_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_posts" ADD CONSTRAINT "journey_posts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supporters" ADD CONSTRAINT "supporters_supporter_id_users_id_fk" FOREIGN KEY ("supporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supporters" ADD CONSTRAINT "supporters_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supporters" ADD CONSTRAINT "supporters_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_supporter_id_supporters_id_fk" FOREIGN KEY ("supporter_id") REFERENCES "public"."supporters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "versions" ADD CONSTRAINT "versions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "supporters_unique_idx" ON "supporters" USING btree ("supporter_id","project_id");