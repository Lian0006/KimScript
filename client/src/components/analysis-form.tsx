import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import { Sparkles, ArrowRight, Zap, Lock, ArrowUpRight } from "lucide-react";
import AnalysisResults from "./analysis-results";
import PlatformSuggestions from "./platform-suggestions";
import { SimpleProgressBar } from "./simple-progress-bar";
import { useProgress } from "@/hooks/use-progress";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";

const formSchema = z.object({
  videoUrl: z.string().url("Please enter a valid URL").min(1, "Video URL is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AnalysisResult {
  id: number;
  transcription: string;
  analysis: any;
  createdAt: string;
}

interface AnalysisFormProps {
  /** Cuando true, el plan free está agotado y se bloquean análisis/generación */
  isBlocked?: boolean;
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export default function AnalysisForm({ isBlocked = false, onAnalysisComplete }: AnalysisFormProps = {}) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { progress, startProgress, updateProgress, completeProgress } = useProgress();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  const analyzeVideoMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsAnalyzing(true);
      startProgress();
      
      const progressSteps = [
        { step: 0, name: 'Extrayendo video...', progress: 20 },
        { step: 1, name: 'Transcribiendo audio...', progress: 40 },
        { step: 2, name: 'Analizando con IA...', progress: 60 },
        { step: 3, name: 'Generando guión...', progress: 80 },
        { step: 4, name: 'Optimizando...', progress: 100 }
      ];

      const result = await apiClient.post("/api/analyze-video", data);
      
      for (let i = 0; i < progressSteps.length; i++) {
        const step = progressSteps[i];
        updateProgress(step.step, step.name, step.progress);
        const delay = i === 1 ? 3000 : i === 2 ? 4000 : 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return result;
    },
    onSuccess: (result: AnalysisResult) => {
      completeProgress();
      setAnalysisResult(result);
      setIsAnalyzing(false);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
      toast({
        title: "¡Análisis Completo!",
        description: "Tu guión personalizado está listo.",
      });
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error: any) => {
      setIsAnalyzing(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "No autorizado",
          description: "Sesión expirada. Redirigiendo...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      
      const errorMessage = error.message || "Error al analizar el video.";
      const isPlanLimit = (error as any)?.status === 403 || errorMessage.includes("límite de tu plan") || (error as any)?.code === "PLAN_LIMIT_REACHED";

      if (isPlanLimit) {
        toast({
          title: "Límite del plan alcanzado",
          description: "Mejora tu plan para seguir analizando videos.",
          variant: "destructive",
        });
        return;
      }
      if (errorMessage.includes('requiere autenticación') || 
          errorMessage.includes('login required') ||
          errorMessage.includes('Instagram') ||
          errorMessage.includes('autenticación')) {
        setShowSuggestions(true);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    analyzeVideoMutation.mutate(data);
  };

  return (
    <>
      {/* Nuevo diseño minimalista */}
      <section className="py-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Bloqueo por límite del plan Free */}
          {isBlocked && (
            <div className="mb-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100">
                <Lock className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-amber-900">Límite del plan Free alcanzado</h3>
              <p className="mt-2 text-sm text-amber-800">
                Has usado todos los análisis incluidos en tu plan. Mejora tu plan para seguir analizando videos y generando guiones.
              </p>
              <Link href="/pricing">
                <Button className="mt-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white">
                  Ver planes y mejorar
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Header minimalista */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Analizar Video Viral</h2>
            </div>
            <p className="text-sm text-gray-500">Transforma contenido viral en scripts de marketing</p>
          </div>

          {/* Formulario horizontal style (deshabilitado si isBlocked) */}
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${isBlocked ? "pointer-events-none opacity-60" : ""}`}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <FormControl>
                          <div className="flex-1 relative">
                            <Input
                              placeholder="🎬 Pega tu URL de TikTok, Instagram o YouTube..."
                              className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl transition-all"
                              disabled={isBlocked}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        
                        <Button
                          type="submit"
                          disabled={analyzeVideoMutation.isPending || isBlocked}
                          className="h-12 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          {analyzeVideoMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Analizando...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              <span>Analizar</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                      
                      {/* Features compactas */}
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          IA Avanzada
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          Multi-plataforma
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                          Resultados en segundos
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Progress bar */}
          {isAnalyzing && (
            <div className="mt-6">
              <SimpleProgressBar
                currentStep={progress.currentStep}
                totalSteps={progress.totalSteps}
                stepName={progress.stepName}
                progress={progress.progress}
              />
            </div>
          )}

          {/* Platform suggestions */}
          {showSuggestions && (
            <div className="mt-6">
              <PlatformSuggestions />
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {analysisResult && (
        <div id="analysis-results">
          <AnalysisResults result={analysisResult} />
        </div>
      )}
    </>
  );
}
