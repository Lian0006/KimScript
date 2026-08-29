import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function applySchema() {
  const client = new Client({
    connectionString: 'postgres://postgres:q03sfDHDteW8IkVrIU8c25BcPb9Y5VfQ8QUDeNxYWqfKADkyinH9LQv2hrqIvYgX@c8w48gkgsok8ok0ocws4ocs0:5432/postgres'
  });

  try {
    await client.connect();
    console.log('🔌 Conectado a PostgreSQL');

    // Leer el archivo SQL
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Aplicando esquema SQL...');
    
    // Ejecutar el SQL
    const result = await client.query(schemaSql);
    
    console.log('✅ Esquema aplicado exitosamente!');
    console.log('📊 Resultado:', result[result.length - 1].rows[0]?.message || 'Completado');

  } catch (error) {
    console.error('❌ Error aplicando esquema:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

applySchema();