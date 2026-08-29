import React, { useEffect, useState } from 'react';
import { ProgressBar, useProgressBar } from './progress-bar';
import { Video, Brain, Zap, FileText, Check } from 'lucide-react';

interface VideoAnalysisProgressProps {
  isAnalyzing: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const VideoAnalysisProgress: React.FC<VideoAnalysisProgressProps> = ({
  isAnalyzing,
  onComplete,
  onError
}) => {
  const { currentStep, steps, setSteps, updateStep, nextStep, resetProgress, setError } = useProgressBar();

  // Definir los pasos del análisis
  const analysisSteps = [
    {
      id: 'video-extraction',
      title: 'Extrayendo Video',
      description: 'Descargando y procesando el video...',
      status: 'pending' as const
    },
    {
      id: 'audio-transcription',
      title: 'Transcribiendo Audio',
      description: 'Convirtiendo audio a texto...',
      status: 'pending' as const
    },
    {
      id: 'ai-analysis',
      title: 'Análisis IA',
      description: 'Analizando contenido con IA...',
      status: 'pending' as const
    },
    {
      id: 'script-generation',
      title: 'Generando Guión',
      description: 'Creando guión viral personalizado...',
      status: 'pending' as const
    },
    {
      id: 'optimization',
      title: 'Optimizando',
      description: 'Aplicando técnicas virales...',
      status: 'pending' as const
    }
  ];

  useEffect(() => {
    if (isAnalyzing) {
      setSteps(analysisSteps);
      resetProgress();
      startAnalysis();
    }
  }, [isAnalyzing]);

  const startAnalysis = async () => {
    try {
      // Paso 1: Extracción de video
      updateStep(0, 'loading');
      await simulateStep(2000); // 2 segundos
      updateStep(0, 'completed');
      nextStep();

      // Paso 2: Transcripción
      updateStep(1, 'loading');
      await simulateStep(3000); // 3 segundos
      updateStep(1, 'completed');
      nextStep();

      // Paso 3: Análisis IA
      updateStep(2, 'loading');
      await simulateStep(4000); // 4 segundos
      updateStep(2, 'completed');
      nextStep();

      // Paso 4: Generación de guión
      updateStep(3, 'loading');
      await simulateStep(3000); // 3 segundos
      updateStep(3, 'completed');
      nextStep();

      // Paso 5: Optimización
      updateStep(4, 'loading');
      await simulateStep(2000); // 2 segundos
      updateStep(4, 'completed');

      // Completado
      setTimeout(() => {
        onComplete?.();
      }, 500);

    } catch (error) {
      setError(currentStep);
      onError?.(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const simulateStep = (duration: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };

  if (!isAnalyzing) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
          <Brain className="h-8 w-8 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Generando tu Guión Viral
        </h2>
        <p className="text-gray-600">
          Estamos analizando tu video y creando el contenido perfecto para ti
        </p>
      </div>

      <ProgressBar 
        steps={steps} 
        currentStep={currentStep}
        className="mb-8"
      />

      {/* Estadísticas en tiempo real */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Video className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {currentStep >= 0 ? '100%' : '0%'}
          </div>
          <div className="text-sm text-gray-500">Video Procesado</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <FileText className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {currentStep >= 1 ? '100%' : '0%'}
          </div>
          <div className="text-sm text-gray-500">Transcripción</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Zap className="h-6 w-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {currentStep >= 2 ? '100%' : '0%'}
          </div>
          <div className="text-sm text-gray-500">Análisis IA</div>
        </div>
      </div>

      {/* Tips mientras procesa */}
      <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">💡</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Tip Pro</h4>
            <p className="text-sm text-yellow-700">
              {currentStep === 0 && "Estamos extrayendo el audio de tu video para obtener la mejor calidad de transcripción."}
              {currentStep === 1 && "Nuestra IA está convirtiendo tu audio en texto con precisión del 95%."}
              {currentStep === 2 && "Analizando elementos virales, hooks, y oportunidades de engagement."}
              {currentStep === 3 && "Generando un guión personalizado basado en tu audiencia objetivo."}
              {currentStep === 4 && "Aplicando técnicas de storytelling y optimización para máxima viralidad."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
