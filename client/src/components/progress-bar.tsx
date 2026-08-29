import React from 'react';
import { Check, Clock, Loader2 } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
}

interface ProgressBarProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  steps, 
  currentStep, 
  className = '' 
}) => {
  const getStepIcon = (step: ProgressStep, index: number) => {
    if (step.status === 'completed') {
      return <Check className="h-5 w-5 text-green-500" />;
    }
    if (step.status === 'loading') {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
    if (step.status === 'error') {
      return <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
        <span className="text-white text-xs font-bold">!</span>
      </div>;
    }
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'loading';
    return 'pending';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
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
                  {getStepIcon(step, index)}
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
      {steps[currentStep] && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            <div>
              <h4 className="font-semibold text-blue-900">
                {steps[currentStep].title}
              </h4>
              <p className="text-sm text-blue-700">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook para manejar el progreso
export const useProgressBar = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [steps, setSteps] = React.useState<ProgressStep[]>([]);

  const updateStep = (stepIndex: number, status: ProgressStep['status']) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const resetProgress = () => {
    setCurrentStep(0);
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
  };

  const setError = (stepIndex: number) => {
    updateStep(stepIndex, 'error');
  };

  return {
    currentStep,
    steps,
    setSteps,
    updateStep,
    nextStep,
    resetProgress,
    setError
  };
};
