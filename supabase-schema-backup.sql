-- Supabase Schema Backup for Import
-- Este archivo prepara la base de datos PostgreSQL para Supabase Self-Hosted

\echo 'Iniciando configuración de Supabase Schema...'

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgjwt";

\echo 'Extensiones creadas exitosamente'

-- Crear schemas necesarios para Supabase
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS realtime;
CREATE SCHEMA IF NOT EXISTS supabase_functions;

\echo 'Schemas de Supabase creados'

-- Crear roles necesarios si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon NOLOGIN NOINHERIT;
        RAISE NOTICE 'Rol anon creado';
    ELSE
        RAISE NOTICE 'Rol anon ya existe';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN NOINHERIT;
        RAISE NOTICE 'Rol authenticated creado';
    ELSE
        RAISE NOTICE 'Rol authenticated ya existe';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
        RAISE NOTICE 'Rol service_role creado';
    ELSE
        RAISE NOTICE 'Rol service_role ya existe';
    END IF;
END
$$;

-- Grant basic permissions
GRANT anon TO postgres;
GRANT authenticated TO postgres;
GRANT service_role TO postgres;

-- Grant permissions en schemas
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA realtime TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Alter default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

\echo 'Permisos configurados exitosamente'

-- Create auth helper functions
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'sub', '')::uuid;
$$;

CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql STABLE
AS $$
    SELECT current_setting('request.jwt.claims', true)::jsonb;
$$;

CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'role', '')::text;
$$;

CREATE OR REPLACE FUNCTION auth.email()
RETURNS text
LANGUAGE sql STABLE
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json ->> 'email', '')::text;
$$;

\echo 'Funciones de autenticación creadas'

-- Enable Row Level Security on existing tables (if they exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS habilitado en tabla users';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scripts') THEN
        ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS habilitado en tabla scripts';
    END IF;
END
$$;

-- Create RLS policies for users table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Policy for users to see their own data
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'users' AND policyname = 'Users can view their own profile'
        ) THEN
            CREATE POLICY "Users can view their own profile" ON users
                FOR SELECT USING (auth.uid()::text = id);
        END IF;
        
        -- Policy for users to update their own data
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'users' AND policyname = 'Users can update their own profile'
        ) THEN
            CREATE POLICY "Users can update their own profile" ON users
                FOR UPDATE USING (auth.uid()::text = id);
        END IF;
        
        -- Service role can do everything
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'users' AND policyname = 'Service role can access all users'
        ) THEN
            CREATE POLICY "Service role can access all users" ON users
                FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        END IF;
    END IF;
END
$$;

-- Create RLS policies for scripts table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scripts') THEN
        -- Policy for users to see their own scripts
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'scripts' AND policyname = 'Users can view their own scripts'
        ) THEN
            CREATE POLICY "Users can view their own scripts" ON scripts
                FOR SELECT USING (auth.uid()::text = "userId");
        END IF;
        
        -- Policy for users to insert their own scripts
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'scripts' AND policyname = 'Users can create their own scripts'
        ) THEN
            CREATE POLICY "Users can create their own scripts" ON scripts
                FOR INSERT WITH CHECK (auth.uid()::text = "userId");
        END IF;
        
        -- Policy for users to update their own scripts
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'scripts' AND policyname = 'Users can update their own scripts'
        ) THEN
            CREATE POLICY "Users can update their own scripts" ON scripts
                FOR UPDATE USING (auth.uid()::text = "userId");
        END IF;
        
        -- Policy for users to delete their own scripts
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'scripts' AND policyname = 'Users can delete their own scripts'
        ) THEN
            CREATE POLICY "Users can delete their own scripts" ON scripts
                FOR DELETE USING (auth.uid()::text = "userId");
        END IF;
        
        -- Service role can do everything
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'scripts' AND policyname = 'Service role can access all scripts'
        ) THEN
            CREATE POLICY "Service role can access all scripts" ON scripts
                FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        END IF;
    END IF;
END
$$;

\echo 'Políticas RLS configuradas'

-- Insert default admin user if users table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        INSERT INTO public.users (id, email, "firstName", "lastName", "createdAt", "updatedAt")
        VALUES 
            ('00000000-0000-0000-0000-000000000000', 'admin@kimscript.com', 'Admin', 'KimScript', now(), now())
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            "firstName" = EXCLUDED."firstName",
            "lastName" = EXCLUDED."lastName",
            "updatedAt" = now();
        RAISE NOTICE 'Usuario admin configurado';
    END IF;
END
$$;

\echo '🎉 ¡Supabase schema configurado exitosamente!'
\echo '✅ Extensiones instaladas'
\echo '✅ Schemas creados'
\echo '✅ Roles configurados'
\echo '✅ Funciones de auth creadas'
\echo '✅ RLS y políticas configuradas'
\echo '✅ Usuario admin creado'

-- Verificación final
SELECT 
    'Configuración completada exitosamente! Supabase está listo para usar.' as status,
    current_timestamp as completed_at;