import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PerformanceMascotProps {
  analysisResult: any;
  className?: string;
}

interface MascotState {
  emoji: string;
  expression: string;
  message: string;
  color: string;
  animation: string;
}

export default function PerformanceMascot({ analysisResult, className }: PerformanceMascotProps) {
  const [mascotState, setMascotState] = useState<MascotState>({
    emoji: "🤖",
    expression: "thinking",
    message: "Analizando...",
    color: "text-gray-600",
    animation: "animate-pulse"
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!analysisResult) return;

    const performanceScore = calculatePerformanceScore(analysisResult);
    const newState = getMascotStateFromScore(performanceScore, analysisResult);
    
    setMascotState(newState);
    setIsVisible(true);

    // Add entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [analysisResult]);

  if (!analysisResult) return null;

  return (
    <div className={cn(
      "relative transition-all duration-500 transform",
      isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0",
      className
    )}>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border-2 border-dashed border-gray-200 hover:border-violet-300 transition-all duration-300">
        {/* Mascot Character */}
        <div className="text-center">
          <div className={cn(
            "text-6xl mb-4 transition-all duration-500",
            mascotState.animation
          )}>
            {mascotState.emoji}
          </div>
          
          {/* Performance Badge */}
          <div className="mb-4">
            <div className={cn(
              "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold",
              getPerformanceBadgeStyle(calculatePerformanceScore(analysisResult))
            )}>
              <span className="mr-2">⚡</span>
              Rendimiento: {calculatePerformanceScore(analysisResult)}%
            </div>
          </div>

          {/* Mascot Message */}
          <div className="space-y-2">
            <p className={cn("font-medium text-lg", mascotState.color)}>
              {mascotState.message}
            </p>
            
            {/* Dynamic Tips */}
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {getMascotTip(analysisResult)}
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className={cn(
                "w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center",
                getHookScore(analysisResult) >= 80 ? "bg-green-100 text-green-600" : 
                getHookScore(analysisResult) >= 60 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
              )}>
                🎯
              </div>
              <span className="text-gray-600">Hook</span>
            </div>
            
            <div className="text-center">
              <div className={cn(
                "w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center",
                getViralScore(analysisResult) >= 80 ? "bg-green-100 text-green-600" : 
                getViralScore(analysisResult) >= 60 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
              )}>
                🚀
              </div>
              <span className="text-gray-600">Viral</span>
            </div>
            
            <div className="text-center">
              <div className={cn(
                "w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center",
                getEngagementScore(analysisResult) >= 80 ? "bg-green-100 text-green-600" : 
                getEngagementScore(analysisResult) >= 60 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
              )}>
                💫
              </div>
              <span className="text-gray-600">Engagement</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        {mascotState.expression === "excellent" && (
          <div className="absolute -top-2 -right-2">
            <div className="animate-bounce text-2xl">🌟</div>
          </div>
        )}
        
        {mascotState.expression === "celebration" && (
          <>
            <div className="absolute -top-1 -left-1 animate-pulse">
              <div className="text-lg">🎉</div>
            </div>
            <div className="absolute -bottom-1 -right-1 animate-pulse delay-150">
              <div className="text-lg">✨</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function calculatePerformanceScore(analysisResult: any): number {
  if (!analysisResult?.analysis) return 0;

  const hookScore = getHookScore(analysisResult);
  const viralScore = getViralScore(analysisResult);
  const engagementScore = getEngagementScore(analysisResult);
  
  return Math.round((hookScore + viralScore + engagementScore) / 3);
}

function getHookScore(analysisResult: any): number {
  const effectiveness = analysisResult?.analysis?.effectiveness;
  if (!effectiveness) return 50;
  
  // Extract percentage from effectiveness string
  const match = effectiveness.match(/(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  
  // Fallback based on effectiveness text
  if (effectiveness.includes('Alto') || effectiveness.includes('Excelente')) return 90;
  if (effectiveness.includes('Bueno') || effectiveness.includes('Efectivo')) return 75;
  if (effectiveness.includes('Medio') || effectiveness.includes('Regular')) return 60;
  return 45;
}

function getViralScore(analysisResult: any): number {
  const viralElements = analysisResult?.analysis?.viralElements?.length || 0;
  const baseScore = Math.min(viralElements * 15, 85);
  
  // Bonus for specific viral triggers
  if (analysisResult?.analysis?.psychologicalTriggers) {
    return Math.min(baseScore + 15, 95);
  }
  
  return baseScore;
}

function getEngagementScore(analysisResult: any): number {
  const cta = analysisResult?.analysis?.cta;
  const emotionalTone = analysisResult?.analysis?.emotionalTone;
  
  let score = 60; // Base score
  
  if (cta && cta.length > 20) score += 15;
  if (emotionalTone && emotionalTone.includes('fuerte')) score += 10;
  if (analysisResult?.analysis?.keyPhrases?.length > 5) score += 15;
  
  return Math.min(score, 95);
}

function getMascotStateFromScore(score: number, analysisResult: any): MascotState {
  if (score >= 90) {
    return {
      emoji: "🎯",
      expression: "celebration",
      message: "¡Increíble! Este video es viral",
      color: "text-green-600",
      animation: "animate-bounce"
    };
  } else if (score >= 80) {
    return {
      emoji: "🚀",
      expression: "excellent",
      message: "¡Excelente análisis! Gran potencial",
      color: "text-blue-600",
      animation: "animate-pulse"
    };
  } else if (score >= 70) {
    return {
      emoji: "⭐",
      expression: "good",
      message: "Buen rendimiento, se puede mejorar",
      color: "text-violet-600",
      animation: "animate-float"
    };
  } else if (score >= 60) {
    return {
      emoji: "📈",
      expression: "improving",
      message: "En progreso, aplica las sugerencias",
      color: "text-yellow-600",
      animation: "animate-pulse"
    };
  } else {
    return {
      emoji: "🎪",
      expression: "encouraging",
      message: "¡Vamos a mejorarlo juntos!",
      color: "text-orange-600",
      animation: "animate-bounce"
    };
  }
}

function getPerformanceBadgeStyle(score: number): string {
  if (score >= 90) return "bg-green-100 text-green-700 border border-green-200";
  if (score >= 80) return "bg-blue-100 text-blue-700 border border-blue-200";
  if (score >= 70) return "bg-violet-100 text-violet-700 border border-violet-200";
  if (score >= 60) return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  return "bg-orange-100 text-orange-700 border border-orange-200";
}

function getMascotTip(analysisResult: any): string {
  const score = calculatePerformanceScore(analysisResult);
  const viralElements = analysisResult?.analysis?.viralElements?.length || 0;
  
  if (score >= 90) {
    return "🎉 ¡Este contenido tiene todos los elementos para ser viral! Compártelo ahora.";
  } else if (score >= 80) {
    return "💡 Considera añadir más elementos emocionales para maximizar el engagement.";
  } else if (score >= 70) {
    return "🎯 El hook es sólido, pero el CTA podría ser más directo y persuasivo.";
  } else if (viralElements < 3) {
    return "⚡ Añade más elementos virales como números específicos o prueba social.";
  } else {
    return "🚀 Analiza videos similares exitosos para identificar patrones ganadores.";
  }
}