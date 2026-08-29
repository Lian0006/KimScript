# Mercado Pago – Suscripciones KimScript

## Modo pruebas (recomendado primero)

Para probar la integración **sin cobros reales**:

1. En el panel de Mercado Pago → Tu integración → **Credenciales de prueba**.
2. Copia el **Access Token** (empieza por `TEST-`) y configúralo en tu backend:
   - **Variable:** `MERCADOPAGO_ACCESS_TOKEN`
   - **Valor:** tu Access Token de prueba (ej. `TEST-1224...`).
3. Opcional: **Public key** de prueba en `MERCADOPAGO_PUBLIC_KEY` si la usas en el frontend.
4. En **Webhooks**, puedes usar una URL de prueba (ej. ngrok o la URL de tu servidor de desarrollo) para recibir notificaciones de prueba.
5. Prueba el flujo: elegir plan → Checkout → Pagar con Mercado Pago. En modo prueba Mercado Pago te permite simular pagos sin cobrar.

Cuando las pruebas estén bien, cambia a **Credenciales de producción** y la misma variable `MERCADOPAGO_ACCESS_TOKEN` con el token de producción.

---

## Variables de entorno

En el servidor (backend) configura:

- **`MERCADOPAGO_ACCESS_TOKEN`** (obligatorio):  
  - **Pruebas:** Access Token de **prueba** (empieza por `TEST-`) en [Credenciales de prueba](https://www.mercadopago.com/developers/panel/app).  
  - **Producción:** Access Token de **producción** para cobros reales.
- **`MERCADOPAGO_PUBLIC_KEY`** (opcional): Public key (TEST o producción). Solo necesaria si usas el SDK de MP en el frontend. Para el flujo actual (redirect a init_point) solo se usa el Access Token en el backend.
- **`FRONTEND_URL`** (recomendado): URL del frontend para la redirección tras el pago. Ej: `https://www.kimscript.com`.

## Webhook

Mercado Pago debe notificar los eventos de suscripción a tu backend:

1. En el [panel de tu aplicación](https://www.mercadopago.com/developers/panel/app) → **Webhooks**.
2. Añade una URL de notificación:  
   **`https://TU_DOMINIO_API/api/webhooks/mercadopago`**  
   (ej: `https://api.kimscript.com/api/webhooks/mercadopago`).
3. Suscríbete al menos a: **Suscripciones (subscription_preapproval)** y, si aplica, **Pagos (payment)**.

Cuando un usuario paga una suscripción, MP envía un POST a esa URL. El backend actualiza la tabla `subscriptions` y el `subscription_plan` del usuario en `users`.

## Flujo

1. Usuario elige plan (Lite, Creator, Profesional) en `/pricing` y va a `/checkout?plan=lite`.
2. En checkout hace clic en **Pagar con Mercado Pago**.
3. Backend crea una fila en `subscriptions` (pending) y un **plan de suscripción** en MP con `external_reference` = id de nuestra suscripción.
4. Backend responde con `initPoint` (URL de checkout de MP).
5. Frontend redirige al usuario a `initPoint`; el usuario paga en Mercado Pago.
6. MP redirige al usuario a `FRONTEND_URL/checkout/success?subscription_id=XXX`.
7. MP envía un webhook a `/api/webhooks/mercadopago` con el evento de la suscripción.
8. Backend recibe el webhook, obtiene el preapproval de MP (con `external_reference`), actualiza la suscripción a `paid` y el `subscription_plan` del usuario.

## Moneda y mínimo (para que abra el checkout)

Por defecto se envía **USD**. Si tu cuenta de Mercado Pago está en **México** (u otro país con moneda local), MP puede exigir un **monto mínimo** (ej. 1600 MXN). Si no lo cumples, devuelve 400 y **no se abre la pantalla de pago**.

Para que **sí se abra** el checkout y el usuario pueda poner la tarjeta:

1. En Coolify (o tu servidor), en las variables de entorno de la API, agrega:
   - **`MERCADOPAGO_CURRENCY`** = `MXN` (o la moneda de tu cuenta)
   - **`MERCADOPAGO_MIN_AMOUNT`** = `1600` (el mínimo que indica MP en el error)
   - **`MERCADOPAGO_USD_TO_LOCAL`** = `17` (aprox. USD → MXN; ajusta si quieres)

2. Guarda y reinicia la API.

El backend convertirá el precio del plan a moneda local y usará al menos el mínimo, así MP devuelve la URL de checkout y el usuario es redirigido a la pantalla de Mercado Pago para ingresar la tarjeta.

## Tabla `subscriptions`

Asegúrate de tener la tabla y la columna `subscription_plan` en `users` ejecutando el script SQL de migración (`supabase-schema-complete.sql` o equivalente).
