# 🚀 Deploy Manual a Render

## Si el repositorio privado no se conecta automáticamente

### 1. Crear Proyecto Manual en Render

1. Ve a [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Selecciona "Deploy without connecting a repository"
4. Configura:
   - **Name**: `assistan2-backend`
   - **Environment**: `Docker`
   - **Plan**: `Free`

### 2. Subir Código Manualmente

#### Opción A: Usar Render CLI
```bash
# Instalar Render CLI
npm install -g @render/cli

# Login
render login

# Deploy
render deploy
```

#### Opción B: Usar Docker
```bash
# Construir imagen localmente
docker build -t assistan2-backend .

# Subir a Docker Hub
docker tag assistan2-backend tu-usuario/assistan2-backend
docker push tu-usuario/assistan2-backend

# En Render, usar la imagen de Docker Hub
```

### 3. Configurar Variables de Entorno

En el dashboard de Render, agrega:
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgresql://...`
- `SUPABASE_URL=...`
- `SUPABASE_ANON_KEY=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`
- `OPENAI_API_KEY=...`

### 4. Configurar Base de Datos

1. Click "New +" → "PostgreSQL"
2. **Name**: `assistan2-db`
3. **Plan**: `Free`
4. Copia la `DATABASE_URL` a las variables de entorno
