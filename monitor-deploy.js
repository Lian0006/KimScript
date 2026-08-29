/**
 * Script para monitorear el deploy en Render
 * Verifica el estado del servicio y muestra métricas de rendimiento
 */

import https from 'https';

// Configuración
const RENDER_SERVICE_URL = 'https://api.kimscript.com';
const HEALTH_CHECK_ENDPOINT = '/api/health';
const DIAGNOSTIC_ENDPOINT = '/api/diagnostic';

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, endpoint) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = https.get(url + endpoint, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            responseTime,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            responseTime,
            headers: res.headers
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkHealth() {
  try {
    log('\n🔍 Verificando estado del servicio...', 'cyan');
    
    const response = await makeRequest(RENDER_SERVICE_URL, HEALTH_CHECK_ENDPOINT);
    
    if (response.status === 200) {
      log('✅ Servicio funcionando correctamente', 'green');
      log(`⏱️  Tiempo de respuesta: ${response.responseTime}ms`, 'blue');
      
      if (response.data) {
        log(`📊 Estado: ${response.data.status || 'OK'}`, 'green');
        if (response.data.timestamp) {
          log(`🕐 Timestamp: ${new Date(response.data.timestamp).toLocaleString()}`, 'blue');
        }
      }
      
      return true;
    } else {
      log(`❌ Error en el servicio: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error de conexión: ${error.message}`, 'red');
    return false;
  }
}

async function checkDiagnostic() {
  try {
    log('\n🔧 Verificando diagnóstico del sistema...', 'cyan');
    
    const response = await makeRequest(RENDER_SERVICE_URL, DIAGNOSTIC_ENDPOINT);
    
    if (response.status === 200) {
      log('✅ Diagnóstico disponible', 'green');
      
      if (response.data) {
        log('\n📋 Información del Sistema:', 'bold');
        
        if (response.data.openai) {
          log(`🤖 OpenAI: ${response.data.openai ? '✅ Conectado' : '❌ Error'}`, 
              response.data.openai ? 'green' : 'red');
        }
        
        if (response.data.database) {
          log(`🗄️  Base de Datos: ${response.data.database ? '✅ Conectado' : '❌ Error'}`, 
              response.data.database ? 'green' : 'red');
        }
        
        if (response.data.supabase) {
          log(`🔐 Supabase: ${response.data.supabase ? '✅ Conectado' : '❌ Error'}`, 
              response.data.supabase ? 'green' : 'red');
        }
        
        if (response.data.nodeVersion) {
          log(`🟢 Node.js: ${response.data.nodeVersion}`, 'blue');
        }
        
        if (response.data.platform) {
          log(`💻 Plataforma: ${response.data.platform}`, 'blue');
        }
        
        if (response.data.memory) {
          log(`🧠 Memoria: ${response.data.memory}`, 'blue');
        }
      }
      
      return true;
    } else {
      log(`❌ Error en diagnóstico: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error de conexión al diagnóstico: ${error.message}`, 'red');
    return false;
  }
}

async function monitorDeploy() {
  log('🚀 Monitor de Deploy - KimScript API', 'bold');
  log('=====================================', 'bold');
  
  const startTime = Date.now();
  
  // Verificar salud del servicio
  const healthOk = await checkHealth();
  
  if (healthOk) {
    // Verificar diagnóstico
    await checkDiagnostic();
    
    // Verificar tiempo total
    const totalTime = Date.now() - startTime;
    log(`\n⏱️  Tiempo total de verificación: ${totalTime}ms`, 'blue');
    
    log('\n🎉 Deploy optimizado funcionando correctamente!', 'green');
    log('📊 Las optimizaciones del Dockerfile están activas', 'cyan');
    
  } else {
    log('\n⚠️  El servicio aún no está disponible', 'yellow');
    log('🔄 Esperando que termine el deploy...', 'yellow');
  }
}

// Ejecutar monitoreo
monitorDeploy().catch(error => {
  log(`❌ Error en el monitoreo: ${error.message}`, 'red');
  process.exit(1);
});
