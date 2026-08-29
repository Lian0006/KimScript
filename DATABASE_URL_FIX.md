# Fix: 500 Error – getaddrinfo EAI_AGAIN supabase-db

## Qué hacer (pasos únicos)

Para que la API de KimScript conecte a tu Postgres self-hosted sin probar IPs ni dominios, **pon la API y el stack de Supabase en la misma red** en Coolify. Así `supabase-db` resolverá y tu `DATABASE_URL` actual funcionará.

---

## Pasos en Coolify

### 1. Crear una red predefinida (si no tienes una)

- En Coolify: **Settings** (o **Networks**) → **Predefined Networks** (o similar).
- Crea una red, por ejemplo: **`kimscript-network`**.
- Guárdala.

### 2. Conectar el stack de Supabase a esa red

- Entra al **Service Stack** de Supabase (el que se llama "supabse").
- En **Configuration**, activa **Connect To Predefined Network**.
- Elige la red que creaste (ej. `kimscript-network`).
- **Save** y **redeploy** el stack para que los contenedores entren en esa red.

### 3. Conectar la API de KimScript a la misma red

- Entra al **servicio** que sirve la API de KimScript (www.kimscript.com).
- En su configuración, busca **Connect To Predefined Network** (o "Network" / "Docker network").
- Conéctalo a la **misma** red (ej. `kimscript-network`).
- **Save** y **redeploy** el servicio de la API.

### 4. Dejar DATABASE_URL con el hostname interno

- En las **variables de entorno** del servicio de la API de KimScript, deja **DATABASE_URL** así (con tu contraseña real):

```
DATABASE_URL=postgresql://postgres:TU_PASSWORD_POSTGRES@supabase-db:5432/postgres
```

- Si en el compose de Supabase el servicio de Postgres se llama distinto (ej. `db`), usa ese nombre en lugar de `supabase-db`.

### 5. Reiniciar

- Reinicia (o redeploy) el servicio de la **API de KimScript** para que levante ya en la nueva red.

---

## Resultado

- La API y Supabase quedan en la misma red Docker.
- Desde la API, el nombre `supabase-db` (o el que tenga Postgres en el compose) se resuelve y la conexión a Postgres funciona.
- No hace falta exponer el puerto 5432 ni tocar firewall.
