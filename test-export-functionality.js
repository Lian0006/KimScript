// Test script to verify export functionality
const testAnalysisData = {
  id: 1,
  videoUrl: "https://www.tiktok.com/@test/video/123456789",
  platform: "TikTok",
  transcription: "¡Este truco te va a sorprender! En solo 30 segundos vas a aprender algo que cambiará tu vida para siempre.",
  analysis: {
    hook: "¡Este truco te va a sorprender!",
    hookType: "Curiosity Gap",
    effectiveness: "Alto - 85%",
    viralElements: ["Promesa de beneficio inmediato", "Timeframe específico", "Transformación personal"],
    viralMechanics: "Uso de curiosity gap y urgencia temporal",
    psychologicalTriggers: "Curiosidad, miedo a perderse algo (FOMO)",
    viralPotential: "80% - Alto potencial viral",
    improvementRecommendations: [
      "Añadir números específicos para mayor credibilidad",
      "Incluir prueba social o testimonios",
      "Fortalecer el call-to-action final"
    ]
  },
  generatedScript: {
    hook: "¿Sabías que puedes aumentar tu productividad en un 200% con esta técnica?",
    body: "Durante años, los expertos han guardado este secreto. Hoy te revelo exactamente cómo aplicarlo paso a paso.",
    cta: "Guarda este video y compártelo con alguien que necesite verlo. ¡Los resultados te van a sorprender!",
    toneOfVoice: "Entusiasta y educativo",
    emotions: ["Curiosidad", "Expectativa", "Motivación"]
  },
  createdAt: new Date().toISOString()
};

console.log("Test data for export functionality:", JSON.stringify(testAnalysisData, null, 2));

// Test encoding for share links
const encodedData = btoa(encodeURIComponent(JSON.stringify(testAnalysisData)));
console.log("Encoded share data length:", encodedData.length);
console.log("Share URL would be: /share/" + encodedData.substring(0, 50) + "...");

// Test decoding
try {
  const decoded = JSON.parse(decodeURIComponent(atob(encodedData)));
  console.log("Decoding successful:", decoded.id === testAnalysisData.id);
} catch (error) {
  console.error("Decoding failed:", error);
}