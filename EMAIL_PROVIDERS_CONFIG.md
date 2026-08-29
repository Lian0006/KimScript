# Configuración de Proveedores de Email para Supabase

## 1. Resend (Recomendado) ⭐

### Ventajas:
- Integración oficial con Supabase
- Plan gratuito: 3,000 emails/mes
- Muy fácil de configurar
- Excelente documentación

### Configuración en Coolify (Supabase):
```
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_tu-api-key-de-resend
SMTP_ADMIN_EMAIL=amor@kimscript.com
SMTP_SENDER_NAME=KimScript
```

### Pasos:
1. Regístrate en https://resend.com
2. Verifica tu dominio `kimscript.com`
3. Obtén tu API key
4. Configura las variables en Supabase

---

## 2. AWS SES (Ya tienes dominio verificado) ✅

### Ventajas:
- Ya tienes `kimscript.com` verificado
- Muy económico: ~$0.10 por 1,000 emails
- Confiable y escalable

### Configuración en Coolify (Supabase):
```
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=[tu-usuario-SMTP-de-AWS]
SMTP_PASS=[tu-contraseña-SMTP-de-AWS]
SMTP_ADMIN_EMAIL=amor@kimscript.com
SMTP_SENDER_NAME=KimScript
```

### Pasos:
1. AWS Console → SES → SMTP Settings
2. Create SMTP credentials
3. Guarda las credenciales
4. Configura las variables en Supabase

---

## 3. SendGrid

### Ventajas:
- Plan gratuito: 100 emails/día
- Confiable y establecido

### Configuración en Coolify (Supabase):
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=[tu-api-key-de-sendgrid]
SMTP_ADMIN_EMAIL=amor@kimscript.com
SMTP_SENDER_NAME=KimScript
```

---

## 4. Mailgun

### Ventajas:
- Plan gratuito: 5,000 emails/mes (primeros 3 meses)
- Buena reputación de entrega

### Configuración en Coolify (Supabase):
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=[tu-usuario-de-mailgun]
SMTP_PASS=[tu-contraseña-de-mailgun]
SMTP_ADMIN_EMAIL=amor@kimscript.com
SMTP_SENDER_NAME=KimScript
```

---

## 5. Postmark

### Ventajas:
- Excelente para emails transaccionales
- Plan gratuito: 100 emails/mes
- Alta tasa de entrega

### Configuración en Coolify (Supabase):
```
SMTP_HOST=smtp.postmarkapp.com
SMTP_PORT=587
SMTP_USER=[tu-server-api-token]
SMTP_PASS=[tu-server-api-token]
SMTP_ADMIN_EMAIL=amor@kimscript.com
SMTP_SENDER_NAME=KimScript
```

---

## Variables Adicionales Requeridas en Supabase:

```
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=false
```

## Después de Configurar:

1. Guarda las variables de entorno en Coolify
2. Reinicia el servicio Supabase
3. Prueba registrando un nuevo usuario
4. Revisa los logs si hay errores




