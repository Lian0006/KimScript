import { useState, useEffect, useCallback } from 'react';

interface ProgressState {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  progress: number;
  isRunning: boolean;
}

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressState>({
    currentStep: 0,
    totalSteps: 5,
    stepName: 'Iniciando análisis...',
    progress: 0,
    isRunning: false
  });

  const startProgress = useCallback(() => {
    setProgress({
      currentStep: 0,
      totalSteps: 5,
      stepName: 'Iniciando análisis...',
      progress: 0,
      isRunning: true
    });
  }, []);

  const updateProgress = useCallback((step: number, stepName: string, progressPercent: number) => {
    setProgress(prev => ({
      ...prev,
      currentStep: step,
      stepName,
      progress: progressPercent
    }));
  }, []);

  const completeProgress = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: 5,
      stepName: 'Análisis completado',
      progress: 100,
      isRunning: false
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({
      currentStep: 0,
      totalSteps: 5,
      stepName: 'Iniciando análisis...',
      progress: 0,
      isRunning: false
    });
  }, []);

  return {
    progress,
    startProgress,
    updateProgress,
    completeProgress,
    resetProgress
  };
};
