-- ============================================
-- ESQUEMA PARA SUPABASE HOSTED (proyecto en supabase.com)
-- Base de datos de KimScript
--
-- Este script es la version corregida de supabase-schema-complete.sql
-- para proyectos Supabase administrados (hosted), donde el usuario
-- "postgres" del SQL Editor NO es dueno del schema "auth" y por lo
-- tanto no puede crear/alterar funciones, roles ni grants ahi
-- (error: "permission denied for schema auth"). En hosted Supabase
-- los roles anon/authenticated/service_role y las funciones
-- auth.uid() / auth.jwt() / auth.role() / auth.email() ya existen
-- de fabrica, asi que no hace falta (ni se puede) crearlos de nuevo.
--
-- IDEMPOTENTE: se puede ejecutar varias veces sin duplicar datos
-- ni fallar.
-- ============================================

-- ============================================
-- PARTE 1: EXTENSIONES
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PARTE 2: CREACION DE TABLAS
-- ============================================

-- Tabla de sesiones (requerida para Replit Auth)
CREATE TABLE IF NOT EXISTS "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"subscription_plan" varchar DEFAULT 'free',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Tabla de scripts
CREATE TABLE IF NOT EXISTS "scripts" (
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

-- Tabla de eventos de analytics
CREATE TABLE IF NOT EXISTS "analytics_events" (
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

-- Tabla de metricas de rendimiento
CREATE TABLE IF NOT EXISTS "performance_metrics" (
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

-- Tabla de analytics diarios
CREATE TABLE IF NOT EXISTS "daily_analytics" (
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

-- Tabla de analytics de comportamiento de usuario
CREATE TABLE IF NOT EXISTS "user_behavior_analytics" (
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

-- Tabla de suscripciones (Mercado Pago)
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"plan_id" varchar NOT NULL,
	"mercadopago_payment_id" varchar,
	"mercadopago_preference_id" varchar,
	"status" varchar NOT NULL DEFAULT 'pending',
	"amount_usd" real,
	"currency" varchar DEFAULT 'USD',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- ============================================
-- PARTE 2b: COLUMNAS NUEVAS EN TABLAS EXISTENTES
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'subscription_plan'
    ) THEN
        ALTER TABLE public.users ADD COLUMN subscription_plan varchar DEFAULT 'free';
    END IF;
END
$$;

-- ============================================
-- PARTE 3: FOREIGN KEYS
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'analytics_events_user_id_users_id_fk'
    ) THEN
        ALTER TABLE "analytics_events"
        ADD CONSTRAINT "analytics_events_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
        ON DELETE no action ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'analytics_events_script_id_scripts_id_fk'
    ) THEN
        ALTER TABLE "analytics_events"
        ADD CONSTRAINT "analytics_events_script_id_scripts_id_fk"
        FOREIGN KEY ("script_id") REFERENCES "public"."scripts"("id")
        ON DELETE no action ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'performance_metrics_script_id_scripts_id_fk'
    ) THEN
        ALTER TABLE "performance_metrics"
        ADD CONSTRAINT "performance_metrics_script_id_scripts_id_fk"
        FOREIGN KEY ("script_id") REFERENCES "public"."scripts"("id")
        ON DELETE no action ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'scripts_user_id_users_id_fk'
    ) THEN
        ALTER TABLE "scripts"
        ADD CONSTRAINT "scripts_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
        ON DELETE no action ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_behavior_analytics_user_id_users_id_fk'
    ) THEN
        ALTER TABLE "user_behavior_analytics"
        ADD CONSTRAINT "user_behavior_analytics_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
        ON DELETE no action ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'subscriptions_user_id_users_id_fk'
    ) THEN
        ALTER TABLE "subscriptions"
        ADD CONSTRAINT "subscriptions_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
        ON DELETE no action ON UPDATE no action;
    END IF;
END
$$;

-- ============================================
-- PARTE 4: INDICES
-- ============================================

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" USING btree ("expire");
CREATE INDEX IF NOT EXISTS "idx_analytics_user_id" ON "analytics_events" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_analytics_event_type" ON "analytics_events" USING btree ("event_type");
CREATE INDEX IF NOT EXISTS "idx_analytics_timestamp" ON "analytics_events" USING btree ("timestamp");
CREATE INDEX IF NOT EXISTS "idx_daily_analytics_date" ON "daily_analytics" USING btree ("date");
CREATE INDEX IF NOT EXISTS "idx_performance_script_id" ON "performance_metrics" USING btree ("script_id");
CREATE INDEX IF NOT EXISTS "idx_user_behavior_user_id" ON "user_behavior_analytics" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_behavior_last_active" ON "user_behavior_analytics" USING btree ("last_active_at");
CREATE INDEX IF NOT EXISTS "idx_subscriptions_user_id" ON "subscriptions" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_subscriptions_mercadopago" ON "subscriptions" USING btree ("mercadopago_payment_id");

-- ============================================
-- PARTE 5: PERMISOS EN TABLAS (schema public, si permitido)
-- ============================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ============================================
-- PARTE 6: ROW LEVEL SECURITY (RLS)
--
-- auth.uid(), auth.jwt() ya existen en Supabase hosted: no se
-- redefinen. auth.uid() devuelve uuid, por eso se castea a text
-- para compararlo contra las columnas varchar "id" / "user_id".
-- ============================================

ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Service role can access all users" ON users;

DROP POLICY IF EXISTS "Users can view their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can create their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can update their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can delete their own scripts" ON scripts;
DROP POLICY IF EXISTS "Service role can access all scripts" ON scripts;

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Service role can access all users" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view their own scripts" ON scripts
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own scripts" ON scripts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own scripts" ON scripts
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own scripts" ON scripts
    FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can access all scripts" ON scripts
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- PARTE 7: DATOS INICIALES
-- ============================================

INSERT INTO public.users (id, email, first_name, last_name, subscription_plan, created_at, updated_at)
VALUES
    ('00000000-0000-0000-0000-000000000000', 'admin@kimscript.com', 'Admin', 'KimScript', 'free', now(), now())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    subscription_plan = COALESCE(users.subscription_plan, EXCLUDED.subscription_plan),
    updated_at = now();

-- ============================================
-- MENSAJE DE EXITO
-- ============================================

SELECT 'Base de datos de KimScript inicializada exitosamente en Supabase (hosted)' as message;
