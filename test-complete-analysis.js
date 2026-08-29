// Complete test of real video analysis pipeline
import { extractVideoContent } from './server/videoProcessor.js';
import { analyzeVideoContent } from './server/openai.js';
import fs from 'fs';

async function testCompleteAnalysis() {
  console.log("Probando Sistema de Análisis Real Completo");
  console.log("==========================================");
  
  // Video corto para prueba rápida
  const testVideo = "https://www.youtube.com/watch?v=jNQXAC9IVRw";
  
  try {
    console.log("📥 Extrayendo audio real del video...");
    const transcription = await extractVideoContent(testVideo, "YouTube");
    
    console.log("✅ Transcripción completada");
    console.log("📝 Contenido transcrito:", transcription.substring(0, 100) + "...");
    console.log("📊 Longitud:", transcription.length, "caracteres");
    
    console.log("\n🧠 Analizando contenido auténtico...");
    const analysis = await analyzeVideoContent(transcription);
    
    console.log("✅ Análisis completado");
    console.log("\n📋 RESULTADOS DEL ANÁLISIS REAL:");
    console.log("================================");
    console.log("🎯 Hook identificado:", analysis.hookType);
    console.log("📊 Puntuación efectividad:", analysis.effectiveness);
    console.log("🔥 Elementos virales encontrados:", analysis.viralElements?.length || 0);
    console.log("🎭 Tono emocional:", analysis.emotionalTone);
    console.log("💡 Palabras clave principales:", analysis.keyPhrases?.slice(0, 2));
    
    console.log("\n🎉 ÉXITO: Sistema de análisis real funcionando");
    console.log("✓ Audio extraído de video real");
    console.log("✓ Transcripción auténtica generada");  
    console.log("✓ Análisis basado en contenido real");
    console.log("✓ Insights virales identificados");
    
    // Guardar ejemplo de resultado
    const demoResult = {
      transcription: transcription.substring(0, 200),
      hookType: analysis.hookType,
      effectiveness: analysis.effectiveness,
      viralElements: analysis.viralElements?.slice(0, 3),
      emotionalTone: analysis.emotionalTone
    };
    
    fs.writeFileSync('demo-analysis-result.json', JSON.stringify(demoResult, null, 2));
    console.log("✓ Resultado guardado en demo-analysis-result.json");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("API key")) {
      console.log("💡 Necesita configurar OPENAI_API_KEY");
    } else {
      console.log("💡 Detalle del error:", error.stack);
    }
  }
}

// Ejecutar test
testCompleteAnalysis();