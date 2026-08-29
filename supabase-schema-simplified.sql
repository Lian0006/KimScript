-- Esquema inicial para Supabase Self-Hosted (Versión Simplificada)
-- Este script prepara la base de datos para funcionar con Supabase

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear schemas necesarios para Supabase
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS realtime;
CREATE SCHEMA IF NOT EXISTS supabase_functions;

-- Crear roles necesarios (sin bloques DO para evitar errores del editor)
CREATE ROLE IF NOT EXISTS anon NOLOGIN NOINHERIT;
CREATE ROLE IF NOT EXISTS authenticated NOLOGIN NOINHERIT;
CREATE ROLE IF NOT EXISTS service_role NOLOGIN NOINHERIT BYPASSRLS;

-- Grant basic permissions
GRANT anon TO postgres;
GRANT authenticated TO postgres;
GRANT service_role TO postgres;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA realtime TO postgres, anon, authenticated, service_role;

-- Alter default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Create auth.uid() function
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'sub', '')::uuid;
$$;

-- Create auth.uid_text() function to return user ID as text
CREATE OR REPLACE FUNCTION auth.uid_text()
RETURNS text
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'sub', '')::text;
$$;

-- Create auth.jwt() function
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql STABLE
AS $$
    SELECT current_setting('request.jwt.claims', true)::jsonb;
$$;

-- Create auth.role() function
CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'role', '')::text;
$$;

-- Create auth.email() function
CREATE OR REPLACE FUNCTION auth.email()
RETURNS text
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'email', '')::text;
$$;

-- Success message
SELECT 'Supabase schema initialized successfully! 🎉' as message;


