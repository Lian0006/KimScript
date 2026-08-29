# 🎯 Render Setup Guide

## Configuración Híbrida: Vercel (Frontend) + Render (Backend)

### 1. Crear Proyecto en Render

1. Ve a [render.com](https://render.com)
2. Inicia sesión con GitHub
3. Click "New +" → "Web Service"
4. Conecta tu repositorio `JairLP02/assistan2`
5. Selecciona "Deploy from GitHub repo"

### 2. Configurar Variables de Entorno en Render

En el dashboard de Render, ve a Environment y agrega:

```bash
# Base de Datos
DATABASE_URL=postgresql://postgres:password@host:port/database

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Node Environment
NODE_ENV=production
PORT=3000
```

### 3. Configurar Base de Datos

Render automáticamente creará una base de datos PostgreSQL. Usa la URL que te proporcione.

### 4. Deploy Automático

Render detectará automáticamente:
- `render.yaml` - Configuración de Render
- `Dockerfile` - Configuración de contenedor
- `package.json` - Scripts de Node.js

### 5. URLs Resultantes

- **Frontend (Vercel)**: `https://assistan2.vercel.app`
- **Backend (Render)**: `https://assistan2-backend.onrender.com`

### 6. Actualizar Frontend

El frontend ya está configurado para usar la URL de Render automáticamente.

### 7. Verificar Deploy

1. Ve a tu proyecto en Render
2. Verifica que el deploy sea exitoso
3. Prueba el endpoint de salud: `https://assistan2-backend.onrender.com/api/health`
4. Prueba el análisis de video desde el frontend

## Ventajas de Render

✅ **100% Gratuito** para proyectos pequeños
✅ **750 horas/mes** de tiempo de ejecución
✅ **Soporte completo para dependencias del sistema**
✅ **Contenedores Docker**
✅ **Base de datos PostgreSQL incluida**
✅ **Deploy automático desde GitHub**
✅ **Variables de entorno fáciles**
✅ **Logs en tiempo real**
✅ **Integración perfecta con Vercel**

## Plan Gratuito de Render

- **750 horas/mes** de tiempo de ejecución
- **Base de datos PostgreSQL** gratuita
- **Deploy automático** desde GitHub
- **SSL automático**
- **Logs en tiempo real**
- **Variables de entorno** ilimitadas

## Comandos Útiles

```bash
# Instalar Render CLI
npm install -g @render/cli

# Login
render login

# Deploy manual
render deploy

# Ver logs
render logs

# Conectar a base de datos
render db connect
```
