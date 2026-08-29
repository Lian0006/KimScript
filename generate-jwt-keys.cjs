// Script para generar claves JWT personalizadas para KimScript Supabase
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generar un secreto fuerte
const JWT_SECRET = 'kimscript-supabase-' + crypto.randomBytes(32).toString('hex');

console.log('🔐 Generando claves JWT para KimScript Supabase Self-Hosted...\n');

// Generar ANON_KEY
const anonPayload = {
  iss: 'supabase',
  ref: 'kimscript',
  role: 'anon',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) // 10 años
};

const ANON_KEY = jwt.sign(anonPayload, JWT_SECRET);

// Generar SERVICE_ROLE_KEY
const servicePayload = {
  iss: 'supabase',
  ref: 'kimscript',
  role: 'service_role',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) // 10 años
};

const SERVICE_ROLE_KEY = jwt.sign(servicePayload, JWT_SECRET);

console.log('✅ Claves JWT generadas exitosamente!\n');
console.log('📋 Variables de entorno para Coolify:\n');
console.log(`JWT_SECRET=${JWT_SECRET}`);
console.log(`ANON_KEY=${ANON_KEY}`);
console.log(`SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}`);
console.log(`\n📋 Variables adicionales:\n`);
console.log('# PostgreSQL Connection');
console.log('POSTGRES_HOST=c8w48gkgsok8ok0ocws4ocs0');
console.log('POSTGRES_PORT=5432');
console.log('POSTGRES_DB=postgres');
console.log('POSTGRES_USER=postgres');
console.log('POSTGRES_PASSWORD=tu-password-de-postgres');
console.log('\n# URLs (actualizar con las URLs reales de Coolify)');
console.log('API_EXTERNAL_URL=https://supabase-api.tu-dominio.coolify.app');
console.log('SITE_URL=https://www.kimscript.com');
console.log('ADDITIONAL_REDIRECT_URLS=https://www.kimscript.com/**');
console.log('\n# Auth Settings');
console.log('DISABLE_SIGNUP=false');
console.log('ENABLE_EMAIL_SIGNUP=true');
console.log('ENABLE_EMAIL_AUTOCONFIRM=false');
console.log('JWT_EXPIRY=3600');
console.log('\n# SMTP (configurar con Resend o tu proveedor)');
console.log('SMTP_HOST=smtp.resend.com');
console.log('SMTP_PORT=587');
console.log('SMTP_USER=resend');
console.log('SMTP_PASS=re_tu-api-key-de-resend');
console.log('SMTP_ADMIN_EMAIL=admin@kimscript.com');
console.log('SMTP_SENDER_NAME=KimScript');
console.log('\n# Secret Key Base');
console.log(`SECRET_KEY_BASE=${crypto.randomBytes(64).toString('hex')}`);

console.log('\n🎯 Próximo paso: Copia estas variables en la configuración de Coolify');