import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Loader2, Brain, Sparkles, Target, Clock, Users, MessageSquare, Video, Building, Download, Lock, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import jsPDF from 'jspdf';

const frameworks = [
  {
    value: "AIDA",
    label: "AIDA",
    description: "Atención, Interés, Deseo, Acción",
    icon: "🎯"
  },
  {
    value: "PAS",
    label: "PAS", 
    description: "Problema, Agitación, Solución",
    icon: "⚡"
  },
  {
    value: "Hook-Story-CTA",
    label: "Hook-Story-CTA",
    description: "Gancho, Historia, Llamada a la Acción",
    icon: "📖"
  },
  {
    value: "Antes/Después",
    label: "Antes/Después",
    description: "Transformación y resultados",
    icon: "🔄"
  },
  {
    value: "Problema/Solución",
    label: "Problema/Solución",
    description: "Identificar y resolver dolor",
    icon: "💡"
  },
  {
    value: "Storytelling",
    label: "Storytelling",
    description: "Narrativa emocional",
    icon: "🎭"
  }
];

const businessTypes = [
  "E-commerce", "SaaS/Tech", "Coaching/Consultoría", "Salud y Bienestar", 
  "Educación", "Inmobiliaria", "Servicios Financieros", "Restaurante/Food",
  "Belleza y Cosmética", "Fitness", "Marketing Digital", "Entretenimiento", "Otro"
];

const contentTypes = [
  "Tutorial/Educativo", "Testimonial", "Producto/Servicio", "Behind the Scenes",
  "Trending/Viral", "User Generated Content", "Promocional", "Storytelling",
  "Comparación", "Demo/Unboxing", "Entrevista", "Tips y Trucos", "Humorístico", "Bloggers"
];

const platforms = [
  { id: "tiktok", name: "TikTok" },
  { id: "instagram", name: "Instagram Reels" },
  { id: "youtube", name: "YouTube Shorts" },
  { id: "facebook", name: "Facebook Reels" },
  { id: "twitter", name: "Twitter/X" },
  { id: "linkedin", name: "LinkedIn" }
];

const videoDurations = [
  { value: "15", label: "15s", description: "Ultra-rápido", icon: "⚡" },
  { value: "30", label: "30s", description: "Hook+CTA", icon: "🎯" },
  { value: "60", label: "60s", description: "Historia completa", icon: "📖" },
  { value: "90", label: "90s", description: "Detallado", icon: "🔍" }
];

const formSchema = z.object({
  scriptTitle: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  businessType: z.string().min(1, "Selecciona el tipo de negocio"),
  contentType: z.string().min(1, "Selecciona el tipo de contenido"),
  framework: z.string().min(1, "Selecciona un framework neurológico"),
  platforms: z.array(z.string()).min(1, "Selecciona al menos una plataforma"),
  videoDuration: z.string().min(1, "Selecciona la duración del video"),
  targetAudience: z.string().min(10, "Describe tu audiencia objetivo (mínimo 10 caracteres)"),
  keyMessage: z.string().min(10, "Define tu mensaje clave (mínimo 10 caracteres)"),
  brandInfo: z.string().min(10, "La descripción de la marca debe tener al menos 10 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

interface AdvancedScriptGeneratorProps {
  analysisId: number;
  /** Cuando true, el plan free está agotado y se bloquea la generación */
  isBlocked?: boolean;
  onScriptGenerated: (script: any) => void;
}

export default function AdvancedScriptGenerator({ analysisId, isBlocked = false, onScriptGenerated }: AdvancedScriptGeneratorProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scriptTitle: "",
      businessType: "",
      contentType: "",
      framework: "",
      platforms: [],
      videoDuration: "",
      targetAudience: "",
      keyMessage: "",
      brandInfo: "",
    },
  });

  const generateScript = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", `/api/generate-script/${analysisId}`, data);
      return response.json();
    },
    onSuccess: (result) => {
      setGeneratedScript(result);
      onScriptGenerated(result);
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      toast({
        title: "¡Guión generado exitosamente!",
        description: "Tu guión viral personalizado está listo.",
      });
    },
    onError: (error: any) => {
      console.error('Script generation error:', error);
      
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesión expirada",
          description: "Redirigiendo al login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      const isPlanLimit = error?.status === 403 || error?.message?.includes("límite de tu plan") || error?.code === "PLAN_LIMIT_REACHED";
      if (isPlanLimit) {
        toast({
          title: "Límite del plan alcanzado",
          description: "Mejora tu plan para seguir generando guiones.",
          variant: "destructive",
        });
        return;
      }
      const errorMessage = error.message || "Hubo un problema al generar tu guión";
      toast({
        title: "Error al generar guión",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error de validación",
        description: "Selecciona al menos una plataforma",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...data,
      platforms: selectedPlatforms,
    };

    generateScript.mutate(submitData);
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setSelectedPlatforms(prev => {
      const updated = checked 
        ? [...prev, platformId]
        : prev.filter(id => id !== platformId);
      form.setValue("platforms", updated);
      return updated;
    });
  };

  const downloadScriptAsPDF = () => {
    if (!generatedScript) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = 30;

      // Header
      doc.setFillColor(139, 92, 246);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Guión Viral Personalizado - KimScript', pageWidth / 2, 15, { align: 'center' });

      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition = 40;

      // Script Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Título del Guión:', margin, yPosition);
      yPosition += 8;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const titleLines = doc.splitTextToSize(form.getValues('scriptTitle') || 'Sin título', contentWidth);
      doc.text(titleLines, margin, yPosition);
      yPosition += titleLines.length * 5 + 10;

      // Hook
      if (generatedScript.hook) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 92, 246);
        doc.text('Hook:', margin, yPosition);
        yPosition += 8;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        const hookLines = doc.splitTextToSize(generatedScript.hook, contentWidth);
        doc.text(hookLines, margin, yPosition);
        yPosition += hookLines.length * 5 + 15;
      }

      // Body
      if (generatedScript.body) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 92, 246);
        doc.text('Cuerpo del Guión:', margin, yPosition);
        yPosition += 8;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        const bodyLines = doc.splitTextToSize(generatedScript.body, contentWidth);
        doc.text(bodyLines, margin, yPosition);
        yPosition += bodyLines.length * 5 + 15;
      }

      // CTA
      if (generatedScript.cta) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 92, 246);
        doc.text('Call to Action:', margin, yPosition);
        yPosition += 8;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        const ctaLines = doc.splitTextToSize(generatedScript.cta, contentWidth);
        doc.text(ctaLines, margin, yPosition);
        yPosition += ctaLines.length * 5 + 15;
      }

      // Technical Script
      if (generatedScript.technicalScript) {
        if (yPosition > 220) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 92, 246);
        doc.text('Guión Técnico:', margin, yPosition);
        yPosition += 8;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        const techLines = doc.splitTextToSize(generatedScript.technicalScript, contentWidth);
        doc.text(techLines, margin, yPosition);
        yPosition += techLines.length * 4 + 15;
      }

      // Viral Hashtags
      if (generatedScript.viralHashtags && generatedScript.viralHashtags.length > 0) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 92, 246);
        doc.text('Hashtags Virales:', margin, yPosition);
        yPosition += 8;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        const hashtagsText = generatedScript.viralHashtags.join(' ');
        const hashtagLines = doc.splitTextToSize(hashtagsText, contentWidth);
        doc.text(hashtagLines, margin, yPosition);
        yPosition += hashtagLines.length * 5 + 15;
      }

      // Visual Suggestions
      if (generatedScript.visualSuggestions && generatedScript.visualSuggestions.length > 0) {
        if (yPosition > 220) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 92, 246);
        doc.text('Sugerencias Visuales:', margin, yPosition);
        yPosition += 8;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        generatedScript.visualSuggestions.forEach((suggestion: string, index: number) => {
          if (yPosition > 260) {
            doc.addPage();
            yPosition = 20;
          }
          const suggestionLines = doc.splitTextToSize(`${index + 1}. ${suggestion}`, contentWidth - 10);
          doc.text(suggestionLines, margin + 5, yPosition);
          yPosition += suggestionLines.length * 4 + 3;
        });
      }

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por KimScript - Transform Viral Videos into Marketing Gold', pageWidth / 2, footerY, { align: 'center' });

      // Save PDF
      const fileName = `guion-viral-${form.getValues('scriptTitle')?.replace(/[^a-zA-Z0-9]/g, '-') || 'personalizado'}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Descargado",
        description: `Guión guardado como ${fileName}`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error al generar PDF",
        description: "No se pudo descargar el guión en PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-50/50 to-blue-50/50 min-h-screen p-6">
      <Card className="max-w-6xl mx-auto shadow-2xl border-0">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Generador de Guión Viral Avanzado</CardTitle>
                <p className="text-purple-100 text-sm mt-1">Configura todos los parámetros para crear el guión perfecto</p>
              </div>
            </div>
            {generatedScript && (
              <Button
                onClick={downloadScriptAsPDF}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="scriptTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        Título del Script
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Rutina matutina viral"
                          className="h-12 border-purple-200 focus:border-purple-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        Tipo de Negocio
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-purple-200">
                            <SelectValue placeholder="Selecciona tu industria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <Video className="h-4 w-4 text-purple-600" />
                        Tipo de Contenido
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-purple-200">
                            <SelectValue placeholder="Selecciona el formato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Framework Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple-600 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Framework Neurológico
                </h3>
                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {frameworks.map((framework) => (
                            <div
                              key={framework.value}
                              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                field.value === framework.value
                                  ? 'border-purple-500 bg-purple-50 shadow-md'
                                  : 'border-gray-200 hover:border-purple-300'
                              }`}
                              onClick={() => field.onChange(framework.value)}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-2">{framework.icon}</div>
                                <h4 className="font-bold text-sm mb-1">{framework.label}</h4>
                                <p className="text-xs text-gray-600">{framework.description}</p>
                              </div>
                              {field.value === framework.value && (
                                <div className="absolute top-2 right-2">
                                  <div className="h-5 w-5 bg-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Platforms and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Plataformas
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => (
                      <div
                        key={platform.id}
                        className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all text-center hover:shadow-md ${
                          selectedPlatforms.includes(platform.id)
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => handlePlatformChange(platform.id, !selectedPlatforms.includes(platform.id))}
                      >
                        <p className="font-medium text-sm">{platform.name}</p>
                        {selectedPlatforms.includes(platform.id) && (
                          <div className="absolute top-2 right-2">
                            <div className="h-5 w-5 bg-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Duración del Video
                  </h3>
                  <FormField
                    control={form.control}
                    name="videoDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            {videoDurations.map((duration) => (
                              <div
                                key={duration.value}
                                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                                  field.value === duration.value
                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                    : 'border-gray-200 hover:border-purple-300'
                                }`}
                                onClick={() => field.onChange(duration.value)}
                              >
                                <div className="text-xl mb-1">{duration.icon}</div>
                                <div className="font-bold text-sm">{duration.label}</div>
                                <div className="text-xs text-gray-600">{duration.description}</div>
                                {field.value === duration.value && (
                                  <div className="absolute top-2 right-2">
                                    <div className="h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs">✓</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Audience and Message */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-600" />
                        Audiencia Objetivo
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ej: Mujeres de 25-35 años, profesionales ocupadas..."
                          className="min-h-[100px] border-purple-200 focus:border-purple-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                        Mensaje Clave
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ej: Una rutina matutina de 15 minutos puede transformar tu día..."
                          className="min-h-[100px] border-purple-200 focus:border-purple-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        Información de la Marca
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe tu marca, productos/servicios, valores..."
                          className="min-h-[100px] border-purple-200 focus:border-purple-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bloqueo por límite del plan */}
              {isBlocked && (
                <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-amber-600" />
                  <p className="text-sm font-medium text-amber-900">Límite del plan Free alcanzado</p>
                  <p className="mt-1 text-xs text-amber-800">Mejora tu plan para seguir generando guiones.</p>
                  <Link href="/pricing">
                    <Button type="button" variant="outline" size="sm" className="mt-3 border-amber-300 text-amber-800 hover:bg-amber-100">
                      Ver planes
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Generate Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={generateScript.isPending || isBlocked}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                >
                  {generateScript.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Generando Guión Viral...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-6 w-6" />
                      Generar Guión Viral
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}