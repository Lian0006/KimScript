import React from 'react';
import { Check, Clock, Loader2 } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
}

interface SimpleProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  progress: number;
  className?: string;
}

export const SimpleProgressBar: React.FC<SimpleProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepName,
  progress,
  className = ''
}) => {
  const steps: ProgressStep[] = [
    {
      id: 'video-extraction',
      title: 'Extrayendo Video',
      description: 'Descargando y procesando el video...',
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'loading' : 'pending'
    },
    {
      id: 'audio-transcription',
      title: 'Transcribiendo Audio',
      description: 'Convirtiendo audio a texto...',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'loading' : 'pending'
    },
    {
      id: 'ai-analysis',
      title: 'Análisis IA',
      description: 'Analizando contenido con IA...',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'loading' : 'pending'
    },
    {
      id: 'script-generation',
      title: 'Generando Guión',
      description: 'Creando guión viral personalizado...',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'loading' : 'pending'
    },
    {
      id: 'optimization',
      title: 'Optimizando',
      description: 'Aplicando técnicas virales...',
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'loading' : 'pending'
    }
  ];

  const getStepIcon = (step: ProgressStep) => {
    if (step.status === 'completed') {
      return <Check className="h-5 w-5 text-green-500" />;
    }
    if (step.status === 'loading') {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isPending = index > currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <div className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-50 border-green-500' 
                    : isActive 
                    ? 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-200' 
                    : 'bg-gray-50 border-gray-300'
                  }
                `}>
                  {getStepIcon(step)}
                </div>

                {/* Step Content */}
                <div className="mt-4 text-center max-w-32">
                  <h3 className={`
                    text-sm font-semibold transition-colors duration-300
                    ${isActive 
                      ? 'text-blue-600' 
                      : isCompleted 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                    }
                  `}>
                    {step.title}
                  </h3>
                  <p className={`
                    text-xs mt-1 transition-colors duration-300
                    ${isActive 
                      ? 'text-blue-500' 
                      : isCompleted 
                      ? 'text-green-500' 
                      : 'text-gray-400'
                    }
                  `}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Details */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          <div>
            <h4 className="font-semibold text-blue-900">
              {stepName}
            </h4>
            <p className="text-sm text-blue-700">
              Progreso: {progress}% completado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
