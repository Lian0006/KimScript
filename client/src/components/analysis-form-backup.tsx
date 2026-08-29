import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import { Video, Sparkles, AlertCircle } from "lucide-react";
import AnalysisResults from "./analysis-results";
import PlatformSuggestions from "./platform-suggestions";
import { SimpleProgressBar } from "./simple-progress-bar";
import { useProgress } from "@/hooks/use-progress";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export default function AnalysisForm({ onAnalysisComplete }: AnalysisFormProps = {}) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { progress, startProgress, updateProgress, completeProgress, resetProgress } = useProgress();

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
      
      // Simular progreso durante el análisis real
      const progressSteps = [
        { step: 0, name: 'Extrayendo video...', progress: 20 },
        { step: 1, name: 'Transcribiendo audio...', progress: 40 },
        { step: 2, name: 'Analizando con IA...', progress: 60 },
        { step: 3, name: 'Generando guión...', progress: 80 },
        { step: 4, name: 'Optimizando...', progress: 100 }
      ];

      // Ejecutar análisis real
      const result = await apiClient.post("/api/analyze-video", data);
      
      // Simular progreso con delays realistas
      for (let i = 0; i < progressSteps.length; i++) {
        const step = progressSteps[i];
        updateProgress(step.step, step.name, step.progress);
        
        // Delay basado en el paso (más tiempo para IA y transcripción)
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
        title: "Analysis Complete!",
        description: "Your custom script is ready.",
      });
      // Scroll to results
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => {
      setIsAnalyzing(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      
      const errorMessage = error.message || "Failed to analyze video. Please try again.";
      
      // Show platform suggestions for authentication errors
      if (errorMessage.includes('requiere autenticación') || 
          errorMessage.includes('login required') ||
          errorMessage.includes('Instagram') ||
          errorMessage.includes('autenticación')) {
        setShowSuggestions(true);
        
        // Also show a more helpful toast message
        setTimeout(() => {
          toast({
            title: "Sugerencia",
            description: "Ve las recomendaciones de plataformas abajo para encontrar videos que funcionen mejor.",
            variant: "default",
          });
        }, 2000);
      }
      
      toast({
        title: "Analysis Failed",
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
      <section id="analysis-form" className="py-4">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Card className="relative bg-white/95 backdrop-blur-xl border-0 shadow-xl rounded-2xl overflow-hidden">
              {/* Compact header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 p-0.5">
                <div className="bg-white rounded-t-2xl">
                  <div className="px-6 py-4 text-center">
                    {/* Compact Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl mb-2">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Compact Title */}
                    <h1 className="text-2xl font-bold mb-1">
                      <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                        Análisis de Video Viral
                      </span>
                    </h1>
                    <p className="text-gray-600 text-sm mb-2">
                      Transform viral content into marketing gold
                    </p>
                    
                    {/* Compact features */}
                    <div className="flex justify-center space-x-4 text-xs">
                      <div className="flex items-center text-gray-500">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                        AI-Powered
                      </div>
                      <div className="flex items-center text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></div>
                        Instant Results
                      </div>
                      <div className="flex items-center text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                        Multi-Platform
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact form section */}
              <div className="px-6 py-4 bg-gradient-to-b from-gray-50/50 to-white">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                            Video URL <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="Paste your TikTok, Instagram Reel, or YouTube Shorts URL here..."
                                className="pl-4 pr-20 py-3 text-sm bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl shadow-sm hover:shadow transition-all"
                                {...field}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-blue-50 text-blue-600 rounded-lg border border-blue-200/50 hover:border-blue-300 transition-all"
                                  onClick={async () => {
                                    try {
                                      const text = await navigator.clipboard.readText();
                                      if (text && (text.includes('tiktok.com') || text.includes('instagram.com') || text.includes('youtube.com'))) {
                                        field.onChange(text);
                                        toast({
                                          title: "URL copiada",
                                          description: "URL pegada desde el portapapeles",
                                        });
                                      } else {
                                        toast({
                                          title: "Sin URL válida",
                                          description: "No se encontró una URL de video válida en el portapapeles",
                                          variant: "destructive",
                                        });
                                      }
                                    } catch (error) {
                                      toast({
                                        title: "Error",
                                        description: "No se pudo acceder al portapapeles",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  <span className="text-base">📋</span>
                                </Button>
                                <Video className="h-4 w-4 text-violet-500" />
                              </div>
                            </div>
                          </FormControl>
                          
                          {/* Compact helper text */}
                          <div className="mt-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">
                                📱 Supports all major platforms
                              </span>
                              <span className="text-blue-600">
                                💡 Click 📋 to paste URL
                              </span>
                            </div>
                          </div>
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Compact submit button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white py-3 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                      disabled={analyzeVideoMutation.isPending}
                    >
                      <span className="flex items-center justify-center space-x-3">
                        {analyzeVideoMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            <span>Analizando Video...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-6 w-6" />
                            <span>Analizar Video</span>
                          </>
                        )}
                      </span>
                    </Button>
                  </form>
                </Form>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Progress Bar Section */}
      {isAnalyzing && (
        <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Generando tu Guión Viral
              </h2>
              <p className="text-gray-600">
                Estamos analizando tu video y creando el contenido perfecto para ti
              </p>
            </div>
            
            <SimpleProgressBar
              currentStep={progress.currentStep}
              totalSteps={progress.totalSteps}
              stepName={progress.stepName}
              progress={progress.progress}
              className="mb-8"
            />
          </div>
        </section>
      )}

      {/* Platform suggestions section */}
      {showSuggestions && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <PlatformSuggestions />
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setShowSuggestions(false)}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Ocultar sugerencias
              </Button>
            </div>
          </div>
        </section>
      )}

      {!showSuggestions && !analysisResult && (
        <section className="py-6">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowSuggestions(true)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Ver recomendaciones de plataformas
            </Button>
          </div>
        </section>
      )}

      {analysisResult && <AnalysisResults result={analysisResult} />}
    </>
  );
}
