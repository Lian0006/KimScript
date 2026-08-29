#!/bin/bash

# Script para crear un backup binario que Coolify puede importar
# Este archivo debe ejecutarse en un entorno con pg_dump disponible

# Crear base de datos temporal con el schema
createdb temp_supabase_db

# Aplicar el schema SQL
psql temp_supabase_db < supabase-schema-backup.sql

# Crear backup binario
pg_dump -Fc -b -v -f supabase-schema.backup temp_supabase_db

# Limpiar
dropdb temp_supabase_db

echo "Backup binario creado: supabase-schema.backup"