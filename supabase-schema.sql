-- Esquema inicial para Supabase Self-Hosted
-- Este script prepara la base de datos para funcionar con Supabase

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgjwt";

-- Crear schemas necesarios para Supabase
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS realtime;
CREATE SCHEMA IF NOT EXISTS supabase_functions;

-- Grant permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA realtime TO postgres, anon, authenticated, service_role;

-- Crear roles necesarios si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon NOLOGIN NOINHERIT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN NOINHERIT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
    END IF;
END
$$;

-- Grant basic permissions
GRANT anon TO postgres;
GRANT authenticated TO postgres;
GRANT service_role TO postgres;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Alter default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Create auth.uid() function if it doesn't exist
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'sub', '')::uuid;
$$;

-- Create auth.uid_text() function to return user ID as text (for varchar id fields)
CREATE OR REPLACE FUNCTION auth.uid_text()
RETURNS text
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'sub', '');
$$;

-- Create auth.jwt() function if it doesn't exist
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql STABLE
AS $$
    SELECT current_setting('request.jwt.claims', true)::jsonb;
$$;

-- Create auth.role() function if it doesn't exist
CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'role', '')::text;
$$;

-- Create function to check if user is authenticated
CREATE OR REPLACE FUNCTION auth.email()
RETURNS text
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'email', '')::text;
$$;

-- Enable Row Level Security on existing tables
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scripts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Service role can access all users" ON users;

-- Create RLS policies for users table
DO $$
BEGIN
    -- Policy for users to see their own data
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" ON users
            FOR SELECT USING (auth.uid_text() = id);
    END IF;
    
    -- Policy for users to update their own data
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" ON users
            FOR UPDATE USING (auth.uid_text() = id);
    END IF;
    
    -- Service role can do everything
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Service role can access all users'
    ) THEN
        CREATE POLICY "Service role can access all users" ON users
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END
$$;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can create their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can update their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can delete their own scripts" ON scripts;
DROP POLICY IF EXISTS "Service role can access all scripts" ON scripts;

-- Create RLS policies for scripts table
DO $$
BEGIN
    -- Policy for users to see their own scripts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'scripts' AND policyname = 'Users can view their own scripts'
    ) THEN
        CREATE POLICY "Users can view their own scripts" ON scripts
            FOR SELECT USING (auth.uid_text() = "userId");
    END IF;
    
    -- Policy for users to insert their own scripts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'scripts' AND policyname = 'Users can create their own scripts'
    ) THEN
        CREATE POLICY "Users can create their own scripts" ON scripts
            FOR INSERT WITH CHECK (auth.uid_text() = "userId");
    END IF;
    
    -- Policy for users to update their own scripts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'scripts' AND policyname = 'Users can update their own scripts'
    ) THEN
        CREATE POLICY "Users can update their own scripts" ON scripts
            FOR UPDATE USING (auth.uid_text() = "userId");
    END IF;
    
    -- Policy for users to delete their own scripts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'scripts' AND policyname = 'Users can delete their own scripts'
    ) THEN
        CREATE POLICY "Users can delete their own scripts" ON scripts
            FOR DELETE USING (auth.uid_text() = "userId");
    END IF;
    
    -- Service role can do everything
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'scripts' AND policyname = 'Service role can access all scripts'
    ) THEN
        CREATE POLICY "Service role can access all scripts" ON scripts
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END
$$;

-- Insert default data or update existing
INSERT INTO public.users (id, email, "firstName", "lastName", "createdAt", "updatedAt")
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'admin@kimscript.com', 'Admin', 'KimScript', now(), now())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    "updatedAt" = now();

-- Success message
SELECT 'Supabase schema initialized successfully! 🎉' as message;