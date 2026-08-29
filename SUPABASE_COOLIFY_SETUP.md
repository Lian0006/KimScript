# Configuración de Supabase Cloud en Coolify

## Problema Detectado

El error `TypeError: Invalid URL` con input `'DATABASE_URL=postgresql://...'` indica que Coolify está pasando **el nombre de la variable incluido en el valor**.

## Solución

### En Coolify - Environment Variables:

Asegúrate de que las variables estén configuradas **SIN** el prefijo del nombre:

```bash
# ❌ INCORRECTO (no incluyas "DATABASE_URL=" en el valor)
DATABASE_URL=DATABASE_URL=postgresql://postgres.bjpmatxoknikrfvjepng:...

# ✅ CORRECTO (solo la URL)
DATABASE_URL=postgresql://postgres.bjpmatxoknikrfvjepng:jair028585@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require
```

### Variables Requeridas en Coolify:

```
DATABASE_URL=postgresql://postgres.bjpmatxoknikrfvjepng:jair028585@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require

SUPABASE_URL=https://bjpmatxoknikrfvjepng.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcG1hdHhva25pa3JmdmplcG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTA5NTgsImV4cCI6MjA3NjY2Njk1OH0.9w90wyjtuMibe1KQ0DORs3q-lsuz75DZPvv8j-a8yiI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcG1hdHhva25pa3JmdmplcG5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA5MDk1OCwiZXhwIjoyMDc2NjY2OTU4fQ.Bm9rUCg3OWZVVfTjIy7slnB6ZgDfiiCXtF-DdjlJSV8

VITE_SUPABASE_URL=https://bjpmatxoknikrfvjepng.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcG1hdHhva25pa3JmdmplcG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTA5NTgsImV4cCI6MjA3NjY2Njk1OH0.9w90wyjtuMibe1KQ0DORs3q-lsuz75DZPvv8j-a8yiI
VITE_API_URL=https://www.kimscript.com/api

NODE_ENV=production
PORT=5000
```

## Pasos para Aplicar:

1. **Ve a Coolify** (`http://100.116.130.91:8000`)
2. **Tu aplicación** → **Configuration** → **Environment Variables**
3. **Elimina todas las variables** actuales
4. **Agrega una por una** las variables de arriba
5. **IMPORTANTE:** Al agregar cada variable:
   - Campo "Name": `DATABASE_URL`
   - Campo "Value": `postgresql://postgres.bjpmatxoknikrfvjepng:...` (SIN el nombre)
6. **Save** y **Redeploy**

## Verificar que Funcione:

```bash
# SSH a tu servidor
ssh tu-servidor

# Ver logs del nuevo contenedor
sudo docker ps | grep f0w04ko0co48swgkso8k448c
sudo docker logs CONTAINER_NAME --tail 20

# Debería mostrar:
# ✅ PostgreSQL is ready!
# ✅ Migrations completed successfully
# 🚀 Starting application server...
```

## Probar la Conexión:

```bash
curl https://www.kimscript.com/api/health
# Debería responder: {"status":"healthy",...}
```

## Notas Importantes:

- **Connection Pooling**: Usa puerto `6543` (pgBouncer) para producción
- **SSL Mode**: `sslmode=require` es necesario para Supabase
- **No incluyas** el nombre de la variable en el valor
- **Redeploy** después de cambiar variables de entorno
