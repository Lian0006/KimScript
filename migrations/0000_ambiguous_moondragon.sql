CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"session_id" varchar,
	"event_type" varchar NOT NULL,
	"event_category" varchar NOT NULL,
	"event_name" varchar NOT NULL,
	"script_id" integer,
	"platform" varchar,
	"framework" varchar,
	"duration" integer,
	"metadata" jsonb,
	"user_agent" text,
	"ip_address" varchar,
	"country" varchar,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"total_users" integer DEFAULT 0,
	"new_users" integer DEFAULT 0,
	"active_users" integer DEFAULT 0,
	"total_analyses" integer DEFAULT 0,
	"total_scripts" integer DEFAULT 0,
	"total_exports" integer DEFAULT 0,
	"total_shares" integer DEFAULT 0,
	"tiktok_analyses" integer DEFAULT 0,
	"instagram_analyses" integer DEFAULT 0,
	"youtube_analyses" integer DEFAULT 0,
	"aida_usage" integer DEFAULT 0,
	"pas_usage" integer DEFAULT 0,
	"hook_story_cta_usage" integer DEFAULT 0,
	"before_after_usage" integer DEFAULT 0,
	"problem_solution_usage" integer DEFAULT 0,
	"storytelling_usage" integer DEFAULT 0,
	"avg_performance_score" real,
	"avg_viral_potential" real,
	"avg_processing_time" real,
	"avg_user_satisfaction" real,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "performance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"script_id" integer NOT NULL,
	"hook_accuracy_score" real,
	"viral_elements_count" integer,
	"sentiment_accuracy" real,
	"analysis_processing_time" integer,
	"script_generation_time" integer,
	"total_processing_time" integer,
	"transcription_quality" real,
	"script_quality" real,
	"user_satisfaction_score" real,
	"export_count" integer DEFAULT 0,
	"share_count" integer DEFAULT 0,
	"copy_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"video_url" text NOT NULL,
	"platform" varchar NOT NULL,
	"script_title" varchar,
	"business_type" varchar,
	"content_type" varchar,
	"framework" varchar,
	"platforms" jsonb,
	"video_duration" varchar,
	"target_audience" text,
	"key_message" text,
	"brand_info" text,
	"transcription" text NOT NULL,
	"analysis" jsonb NOT NULL,
	"generated_script" jsonb,
	"performance_score" real,
	"viral_potential_score" real,
	"engagement_prediction" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_behavior_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"total_sessions" integer DEFAULT 0,
	"total_analyses" integer DEFAULT 0,
	"total_scripts" integer DEFAULT 0,
	"avg_session_duration" integer,
	"favorite_framework" varchar,
	"favorite_business_type" varchar,
	"favorite_content_type" varchar,
	"most_used_platform" varchar,
	"avg_performance_score" real,
	"best_performance_score" real,
	"total_exports" integer DEFAULT 0,
	"total_shares" integer DEFAULT 0,
	"last_active_at" timestamp,
	"streak_days" integer DEFAULT 0,
	"total_time_spent" integer DEFAULT 0,
	"high_performing_scripts" integer DEFAULT 0,
	"viral_predictions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_script_id_scripts_id_fk" FOREIGN KEY ("script_id") REFERENCES "public"."scripts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_metrics" ADD CONSTRAINT "performance_metrics_script_id_scripts_id_fk" FOREIGN KEY ("script_id") REFERENCES "public"."scripts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_behavior_analytics" ADD CONSTRAINT "user_behavior_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_analytics_user_id" ON "analytics_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_analytics_event_type" ON "analytics_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_analytics_timestamp" ON "analytics_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_daily_analytics_date" ON "daily_analytics" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_performance_script_id" ON "performance_metrics" USING btree ("script_id");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "idx_user_behavior_user_id" ON "user_behavior_analytics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_behavior_last_active" ON "user_behavior_analytics" USING btree ("last_active_at");