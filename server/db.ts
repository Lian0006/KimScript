import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create postgres client for Drizzle
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

// Create Supabase client for server-side API calls.
// Prefer SERVICE_ROLE for backend tasks; fall back to ANON.
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL must be set");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY must be set");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
);