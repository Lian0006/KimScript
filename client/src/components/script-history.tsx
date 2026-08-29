import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  File, Copy, 
  Download, 
  Trash2, 
  Calendar,
  Clock,
  Eye,
  Brain,
  Sparkles,
  Play,
  MoreHorizontal,
  Hash,
  Zap,
  Search,
  Filter,
  X,
  Edit,
  Building,
  Video,
  Target,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from "lucide-react";
import jsPDF from 'jspdf';
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Script {
  id: number;
  videoUrl: string;
  platform: string;
  brandInfo: string;
  tone?: string;
  transcription: string;
  analysis: any;
  generatedScript?: {
    hook: string;
    body: string;
    cta: string;
    emotions?: string[];
    visualSuggestions?: string[];
    toneOfVoice?: string;
    framework?: string;
    frameworkStructure?: string;
    technicalScript?: string;
    viralHashtags?: string[];
  };
  scriptTitle?: string;
  businessType?: string;
  contentType?: string;
  framework?: string;
  platforms?: string[] | string;
  videoDuration?: string;
  targetAudience?: string;
  keyMessage?: string;
  createdAt: string;
}

// Advanced options from the original generator
const frameworks = [
  { value: "AIDA", label: "AIDA", description: "Atención, Interés, Deseo, Acción", icon: "🎯" },
  { value: "PAS", label: "PAS", description: "Problema, Agitación, Solución", icon: "⚡" },
  { value: "Hook-Story-CTA", label: "Hook-Story-CTA", description: "Gancho, Historia, Llamada a la Acción", icon: "📖" },
  { value: "Antes/Después", label: "Antes/Después", description: "Transformación y resultados", icon: "🔄" },
  { value: "Problema/Solución", label: "Problema/Solución", description: "Identificar y resolver dolor", icon: "💡" },
  { value: "Storytelling", label: "Storytelling", description: "Narrativa emocional", icon: "🎭" }
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

// Form schema for editing scripts
const editFormSchema = z.object({
  scriptTitle: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  brandInfo: z.string().min(10, "La descripción de la marca debe tener al menos 10 caracteres"),
  businessType: z.string().min(1, "Selecciona el tipo de negocio"),
  contentType: z.string().min(1, "Selecciona el tipo de contenido"),
  framework: z.string().min(1, "Selecciona un framework neurológico"),
  platforms: z.array(z.string()).min(1, "Selecciona al menos una plataforma"),
  videoDuration: z.string().min(1, "Selecciona la duración del video"),
  targetAudience: z.string().min(10, "Describe tu audiencia objetivo (mínimo 10 caracteres)"),
  keyMessage: z.string().min(10, "Define tu mensaje clave (mínimo 10 caracteres)"),
});

type EditFormData = z.infer<typeof editFormSchema>;

// Edit Interface Component
function ScriptEditInterface({ 
  script, 
  onScriptUpdated, 
  onCancel 
}: { 
  script: Script; 
  onScriptUpdated: (script: any) => void; 
  onCancel: () => void; 
}) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBrandInfoExpanded, setIsBrandInfoExpanded] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(() => {
    if (!script.platforms) return [];
    if (Array.isArray(script.platforms)) return script.platforms;
    if (typeof script.platforms === 'string') return script.platforms.split(',').map((p: string) => p.trim());
    return [];
  });

  const form = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      scriptTitle: script.scriptTitle || "",
      brandInfo: script.brandInfo || "",
      businessType: script.businessType || "",
      contentType: script.contentType || "",
      framework: script.framework || "Hook-Story-CTA",
      platforms: selectedPlatforms,
      videoDuration: script.videoDuration || "",
      targetAudience: script.targetAudience || "",
      keyMessage: script.keyMessage || "",
    },
  });

  const handlePlatformToggle = (platformId: string) => {
    const updatedPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(p => p !== platformId)
      : [...selectedPlatforms, platformId];
    
    setSelectedPlatforms(updatedPlatforms);
    form.setValue("platforms", updatedPlatforms);
  };

  const regenerateScript = useMutation({
    mutationFn: async (data: EditFormData) => {
      setIsGenerating(true);
      const response = await apiRequest("POST", `/api/generate-script/${script.id}`, {
        brandInfo: data.brandInfo,
        framework: data.framework,
        scriptTitle: data.scriptTitle,
        businessType: data.businessType,
        contentType: data.contentType,
        platforms: data.platforms,
        videoDuration: data.videoDuration,
        targetAudience: data.targetAudience,
        keyMessage: data.keyMessage,
      });
      return response;
    },
    onSuccess: (result) => {
      setIsGenerating(false);
      onScriptUpdated(result);
      toast({
        title: "Script regenerado",
        description: "Tu script ha sido actualizado con los nuevos parámetros.",
      });
    },
    onError: (error) => {
      setIsGenerating(false);
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
      toast({
        title: "Error al regenerar script",
        description: "No se pudo actualizar el script. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditFormData) => {
    regenerateScript.mutate(data);
  };

  return (
    <div className="space-y-8">
      {/* Current Script Display */}
      {script.generatedScript && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Script Actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h4 className="font-bold text-purple-900 mb-3">HOOK</h4>
              <p className="text-gray-700 text-lg">{script.generatedScript.hook}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-3">CUERPO</h4>
              <p className="text-gray-700 text-lg">{script.generatedScript.body}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-900 mb-3">LLAMADA A LA ACCIÓN</h4>
              <p className="text-gray-700 text-lg">{script.generatedScript.cta}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Script Preview */}
      {script.generatedScript && (
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <Eye className="h-6 w-6 mr-2 text-blue-600" />
              Script Actual
            </CardTitle>
            <p className="text-gray-600">Vista previa del script que vas a regenerar</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  HOOK
                </h4>
                <p className="text-gray-700">{script.generatedScript.hook}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  CUERPO
                </h4>
                <p className="text-gray-700">{script.generatedScript.body}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h4 className="font-bold text-green-900 mb-2 flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  LLAMADA A LA ACCIÓN
                </h4>
                <p className="text-gray-700">{script.generatedScript.cta}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">Editar y Regenerar Script</CardTitle>
          <p className="text-gray-600">Modifica los parámetros y regenera tu script con mejores resultados</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Script Title */}
              <FormField
                control={form.control}
                name="scriptTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                      Título del Script
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej: Script viral para producto tech innovador" 
                        className="text-lg p-4"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Type */}
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-600" />
                      Tipo de Negocio
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-lg p-4">
                          <SelectValue placeholder="Selecciona tu tipo de negocio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Type */}
              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center">
                      <Video className="h-5 w-5 mr-2 text-green-600" />
                      Tipo de Contenido
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-lg p-4">
                          <SelectValue placeholder="Selecciona el tipo de contenido" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Framework Selection */}
              <FormField
                control={form.control}
                name="framework"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-purple-600" />
                      Framework Neurológico
                    </FormLabel>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {frameworks.map((framework) => (
                        <div
                          key={framework.value}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            field.value === framework.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => field.onChange(framework.value)}
                        >
                          <div className="text-2xl mb-2">{framework.icon}</div>
                          <h3 className="font-semibold text-gray-900">{framework.label}</h3>
                          <p className="text-sm text-gray-600">{framework.description}</p>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Brand Info - Expandable */}
              <FormField
                control={form.control}
                name="brandInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center justify-between">
                      <div className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                        Información de la Marca/Producto
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsBrandInfoExpanded(!isBrandInfoExpanded)}
                        className="ml-2"
                      >
                        {isBrandInfoExpanded ? (
                          <>
                            <Minimize2 className="h-4 w-4 mr-1" />
                            Compactar
                          </>
                        ) : (
                          <>
                            <Maximize2 className="h-4 w-4 mr-1" />
                            Expandir
                          </>
                        )}
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu marca, producto o servicio en detalle. Incluye características únicas, beneficios principales, público objetivo, valores de marca, diferenciadores competitivos, y cualquier información relevante que ayude a crear un script más personalizado y efectivo..."
                        className={`text-lg p-4 transition-all duration-300 ${
                          isBrandInfoExpanded 
                            ? 'min-h-[300px] max-h-[500px] resize-y' 
                            : 'min-h-[120px] resize-none'
                        }`}
                        {...field}
                      />
                    </FormControl>
                    {isBrandInfoExpanded && (
                      <div className="text-sm text-gray-600 mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="font-semibold text-purple-800 mb-2">💡 Consejos para una mejor descripción:</div>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Incluye los beneficios únicos de tu producto/servicio</li>
                          <li>Menciona tu público objetivo específico</li>
                          <li>Describe el problema que resuelves</li>
                          <li>Agrega testimonios o resultados destacados</li>
                          <li>Incluye tu propuesta de valor diferencial</li>
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Platform Selection */}
              <FormField
                control={form.control}
                name="platforms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center">
                      <Target className="h-5 w-5 mr-2 text-orange-600" />
                      Plataformas de Destino
                    </FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {platforms.map((platform) => (
                        <div
                          key={platform.id}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPlatforms.includes(platform.id)
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => handlePlatformToggle(platform.id)}
                        >
                          <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                        </div>
                      ))}
                    </div>
                    {selectedPlatforms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedPlatforms.map((platformId) => {
                          const platform = platforms.find(p => p.id === platformId);
                          return (
                            <Badge key={platformId} variant="secondary" className="text-orange-700 bg-orange-100">
                              {platform?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Video Duration */}
              <FormField
                control={form.control}
                name="videoDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-red-600" />
                      Duración del Video
                    </FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {videoDurations.map((duration) => (
                        <div
                          key={duration.value}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            field.value === duration.value
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                          onClick={() => field.onChange(duration.value)}
                        >
                          <div className="text-2xl mb-2">{duration.icon}</div>
                          <h3 className="font-semibold text-gray-900">{duration.label}</h3>
                          <p className="text-sm text-gray-600">{duration.description}</p>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Audience */}
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center">
                      <Users className="h-5 w-5 mr-2 text-indigo-600" />
                      Audiencia Objetivo
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: Emprendedores de 25-40 años interesados en productividad y tecnología..."
                        className="min-h-[100px] text-lg p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Key Message */}
              <FormField
                control={form.control}
                name="keyMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-teal-600" />
                      Mensaje Clave
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: Nuestro producto revoluciona la forma de trabajar desde casa..."
                        className="min-h-[100px] text-lg p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Regenerando...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Regenerar Script
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isGenerating}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ScriptHistory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFramework, setFilterFramework] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ["/api/scripts"],
  });

  const deleteScriptMutation = useMutation({
    mutationFn: async (scriptId: number) => {
      await apiRequest("DELETE", `/api/scripts/${scriptId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      toast({
        title: "Script eliminado",
        description: "El script se ha eliminado correctamente.",
      });
    },
    onError: (error) => {
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
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el script. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const copyScript = async (script: Script) => {
    try {
      const scriptText = script.generatedScript 
        ? `HOOK:\n${script.generatedScript.hook}\n\nBODY:\n${script.generatedScript.body}\n\nCTA:\n${script.generatedScript.cta}`
        : script.transcription;
      
      await navigator.clipboard.writeText(scriptText);
      toast({
        title: "Copiado al portapapeles",
        description: "El contenido del script se ha copiado.",
      });
    } catch (error) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el contenido.",
        variant: "destructive",
      });
    }
  };

  const downloadScriptPDF = (script: Script) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let currentY = 30;

    // Helper function to check if content fits on current page and add page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (currentY + requiredHeight > pageHeight - 40) {
        pdf.addPage();
        currentY = 30;
        return true;
      }
      return false;
    };

    // Helper function to add text with proper wrapping and page breaks
    const addWrappedText = (text: string, fontSize: number = 10, fontStyle: string = 'normal', indent: number = 0, textColor: [number, number, number] = [0, 0, 0]) => {
      if (!text || text.trim() === '') return 0;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      
      const lineHeight = fontSize * 0.8; // Better line spacing
      const lines = pdf.splitTextToSize(text.trim(), maxWidth - indent);
      
      checkPageBreak(lines.length * lineHeight + 8);
      
      lines.forEach((line: string, index: number) => {
        if (line.trim()) { // Only add non-empty lines
          pdf.text(line, margin + indent, currentY + (index * lineHeight));
        }
      });
      
      currentY += lines.length * lineHeight + 8; // More spacing between sections
      pdf.setTextColor(0, 0, 0); // Reset to black
      return lines.length;
    };

    // Helper function to add section header with better styling
    const addSectionHeader = (title: string, fontSize: number = 14, addSpacing: boolean = true, color: [number, number, number] = [0, 0, 0]) => {
      if (addSpacing) currentY += 12;
      checkPageBreak(fontSize + 15);
      
      // Add a subtle line above major sections
      if (fontSize >= 16) {
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY - 5, pageWidth - margin, currentY - 5);
        currentY += 3;
      }
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(color[0], color[1], color[2]);
      pdf.text(title, margin, currentY);
      pdf.setTextColor(0, 0, 0); // Reset to black
      currentY += fontSize + 10;
    };

    // Title Page
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const title = script.scriptTitle || "SCRIPT VIRAL GENERADO";
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, currentY);
    currentY += 25;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    const subtitle = "GENERADO POR KIMSCRIPT";
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, currentY);
    currentY += 30;

    // Video Information Section
    addSectionHeader('INFORMACIÓN DEL VIDEO', 16, false);
    
    // Create a structured info display
    const videoInfoData = [
      { label: 'URL del Video:', value: script.videoUrl },
      { label: 'Plataforma:', value: script.platform },
      { label: 'Fecha de Creación:', value: new Date(script.createdAt).toLocaleDateString('es-ES') }
    ];

    if (script.businessType) videoInfoData.push({ label: 'Tipo de Negocio:', value: script.businessType });
    if (script.contentType) videoInfoData.push({ label: 'Tipo de Contenido:', value: script.contentType });
    if (script.platforms) {
      const platformsList = Array.isArray(script.platforms) ? script.platforms.join(', ') : script.platforms;
      videoInfoData.push({ label: 'Plataformas Objetivo:', value: platformsList });
    }
    if (script.videoDuration) videoInfoData.push({ label: 'Duración:', value: `${script.videoDuration} segundos` });
    if (script.targetAudience) videoInfoData.push({ label: 'Audiencia Objetivo:', value: script.targetAudience });
    if (script.keyMessage) videoInfoData.push({ label: 'Mensaje Clave:', value: script.keyMessage });

    videoInfoData.forEach(({ label, value }) => {
      checkPageBreak(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(label, margin, currentY);
      
      pdf.setFont('helvetica', 'normal');
      const valueLines = pdf.splitTextToSize(value, maxWidth - 50);
      valueLines.forEach((line: string, index: number) => {
        pdf.text(line, margin + 50, currentY + (index * 6));
      });
      currentY += Math.max(valueLines.length * 6, 12) + 3;
    });

    // Brand Information Section
    if (script.brandInfo) {
      addSectionHeader('INFORMACIÓN DE MARCA/PRODUCTO');
      addWrappedText(script.brandInfo, 10);
    }

    // Transcription Section
    if (script.transcription) {
      addSectionHeader('TRANSCRIPCIÓN DEL VIDEO');
      addWrappedText(script.transcription, 10);
    }

    // Analysis Section
    if (script.analysis) {
      addSectionHeader('ANÁLISIS VIRAL DETALLADO', 18, true, [139, 69, 19]); // Brown color
      
      // Hook Analysis
      if (script.analysis.hook) {
        addSectionHeader('HOOK IDENTIFICADO', 14, true, [59, 130, 246]); // Blue color
        addWrappedText(script.analysis.hook, 11, 'normal', 5);
        
        if (script.analysis.hookType) {
          addSectionHeader('TIPO DE HOOK', 12, true, [75, 85, 99]); // Gray color
          addWrappedText(script.analysis.hookType, 10, 'normal', 5);
        }
        
        if (script.analysis.effectiveness) {
          addSectionHeader('EFECTIVIDAD DEL HOOK', 12, true, [75, 85, 99]);
          addWrappedText(script.analysis.effectiveness, 10, 'normal', 5);
        }
      }

      // Viral Elements
      if (script.analysis.viralElements && script.analysis.viralElements.length > 0) {
        addSectionHeader('ELEMENTOS VIRALES DETECTADOS', 14);
        script.analysis.viralElements.forEach((element: string, index: number) => {
          addWrappedText(`${index + 1}. ${element}`, 10);
        });
      }

      // Storytelling Structure
      if (script.analysis.storytellingStructure) {
        addSectionHeader('ESTRUCTURA NARRATIVA', 14);
        
        if (script.analysis.storytellingStructure.beginning) {
          addSectionHeader('INICIO', 12);
          addWrappedText(script.analysis.storytellingStructure.beginning, 10);
        }
        
        if (script.analysis.storytellingStructure.middle) {
          addSectionHeader('DESARROLLO', 12);
          addWrappedText(script.analysis.storytellingStructure.middle, 10);
        }
        
        if (script.analysis.storytellingStructure.end) {
          addSectionHeader('FINAL', 12);
          addWrappedText(script.analysis.storytellingStructure.end, 10);
        }
      }

      // Call to Action Analysis
      if (script.analysis.cta) {
        addSectionHeader('LLAMADA A LA ACCIÓN ORIGINAL', 14);
        addWrappedText(script.analysis.cta, 11);
      }

      // Emotional Tone
      if (script.analysis.emotionalTone) {
        addSectionHeader('TONO EMOCIONAL', 14);
        addWrappedText(script.analysis.emotionalTone, 10);
      }

      // Key Phrases
      if (script.analysis.keyPhrases && script.analysis.keyPhrases.length > 0) {
        addSectionHeader('FRASES CLAVE IDENTIFICADAS', 14);
        script.analysis.keyPhrases.forEach((phrase: string, index: number) => {
          addWrappedText(`"${phrase}"`, 10, 'italic');
        });
      }

      // Viral Mechanics
      if (script.analysis.viralMechanics) {
        addSectionHeader('MECÁNICAS VIRALES', 14);
        addWrappedText(script.analysis.viralMechanics, 10);
      }

      // Psychological Triggers
      if (script.analysis.psychologicalTriggers) {
        addSectionHeader('DISPARADORES PSICOLÓGICOS', 14);
        addWrappedText(script.analysis.psychologicalTriggers, 10);
      }

      // Target Audience
      if (script.analysis.targetAudience) {
        addSectionHeader('AUDIENCIA OBJETIVO IDENTIFICADA', 14);
        addWrappedText(script.analysis.targetAudience, 10);
      }

      // Content Framework
      if (script.analysis.contentFramework) {
        addSectionHeader('FRAMEWORK DE CONTENIDO', 14);
        addWrappedText(script.analysis.contentFramework, 10);
      }

      // Viral Potential
      if (script.analysis.viralPotential) {
        addSectionHeader('POTENCIAL VIRAL', 14);
        addWrappedText(script.analysis.viralPotential, 10);
      }

      // Engagement Prediction
      if (script.analysis.engagementPrediction) {
        addSectionHeader('PREDICCIÓN DE ENGAGEMENT', 14);
        addWrappedText(script.analysis.engagementPrediction, 10);
      }

      // Improvement Recommendations
      if (script.analysis.improvementRecommendations && script.analysis.improvementRecommendations.length > 0) {
        addSectionHeader('RECOMENDACIONES DE MEJORA', 14);
        script.analysis.improvementRecommendations.forEach((recommendation: string, index: number) => {
          addWrappedText(`${index + 1}. ${recommendation}`, 10);
        });
      }
    }

    if (script.generatedScript) {
      // Main Script Section
      addSectionHeader('SCRIPT PERSONALIZADO', 18);
      
      // Hook Section
      addSectionHeader('HOOK (GANCHO INICIAL)', 14);
      addWrappedText(script.generatedScript.hook, 11);

      // Body Section
      addSectionHeader('DESARROLLO DEL CONTENIDO', 14);
      addWrappedText(script.generatedScript.body, 11);

      // CTA Section
      addSectionHeader('LLAMADA A LA ACCIÓN (CTA)', 14);
      addWrappedText(script.generatedScript.cta, 11);

      // Helper function to validate content quality
      const isValidContent = (content: string): boolean => {
        if (!content || content.trim().length < 2) return false;
        if (/^[-\s]*$/.test(content)) return false;
        return true;
      };

      // Helper function for traditional cinematographic formatting
      const addTraditionalElement = (elementType: string, content: string, shotNumber: number, currentSceneNumber: string) => {
        checkPageBreak(25);
        
        // Clean content and remove unwanted characters/patterns
        let cleanContent = content.replace(/[\[\]]/g, '').trim();
        cleanContent = cleanContent.replace(/%P%/g, '').trim();
        cleanContent = cleanContent.replace(/%[A-Z]%/g, '').trim();
        cleanContent = cleanContent.replace(/SONIDO:\s*/gi, '').trim();
        cleanContent = cleanContent.replace(/\s+/g, ' ').trim();
        cleanContent = cleanContent.replace(/\s*-\s*$/, '').trim();
        cleanContent = cleanContent.replace(/^[-\s]+/, '').trim();
        cleanContent = cleanContent.replace(/[-\s]+$/, '').trim();
        
        // Only skip if completely empty after cleaning
        if (!cleanContent || cleanContent.length < 3) return;
        
        switch (elementType) {
          case 'SLUGLINE':
          case 'TIMING':
            // Location/Time in ALL CAPS, left margin
            currentY += 5;
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            
            const locationText = cleanContent.toUpperCase();
            const locationLines = pdf.splitTextToSize(locationText, maxWidth - 20);
            
            locationLines.forEach((line: string, index: number) => {
              checkPageBreak(12);
              pdf.text(line, margin + 20, currentY + (index * 14));
            });
            
            currentY += locationLines.length * 14 + 4;
            break;
            
          case 'DESCRIPCIÓN':
            // Action description, full width, regular text
            currentY += 2;
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            
            const actionLines = pdf.splitTextToSize(cleanContent, maxWidth - 40);
            
            actionLines.forEach((line: string, index: number) => {
              checkPageBreak(12);
              pdf.text(line, margin + 20, currentY + (index * 13));
            });
            
            currentY += actionLines.length * 13 + 3;
            break;
            
          case 'DIÁLOGO':
            // Dialogue/Narration centered with character name
            currentY += 5;
            
            // Extract character name if present, otherwise use "NARRADOR"
            let characterName = 'NARRADOR';
            let dialogueText = cleanContent;
            
            if (cleanContent.includes(':')) {
              const parts = cleanContent.split(':');
              if (parts.length >= 2) {
                characterName = parts[0].trim().toUpperCase();
                dialogueText = parts.slice(1).join(':').trim();
              }
            }
            
            // Character name (centered)
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            const charNameWidth = pdf.getTextWidth(characterName);
            const charNameX = margin + (maxWidth - charNameWidth) / 2;
            pdf.text(characterName, charNameX, currentY);
            currentY += 12;
            
            // Dialogue (centered, narrower width)
            pdf.setFont('helvetica', 'normal');
            const dialogueWidth = maxWidth * 0.6;
            const dialogueX = margin + (maxWidth - dialogueWidth) / 2;
            const dialogueLines = pdf.splitTextToSize(dialogueText, dialogueWidth);
            
            dialogueLines.forEach((line: string, index: number) => {
              checkPageBreak(12);
              pdf.text(line, dialogueX, currentY + (index * 13));
            });
            
            currentY += dialogueLines.length * 13 + 8;
            break;
            
          case 'ACOTACIONES':
            // Technical specifications as shot numbers (like 1-1, 1-2)
            currentY += 3;
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 100, 200); // Blue for technical specs
            
            const shotLabel = `${currentSceneNumber}-${shotNumber}`;
            pdf.text(shotLabel, margin + 20, currentY);
            
            // Technical content in blue
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);
            const techLines = pdf.splitTextToSize(cleanContent, maxWidth - 80);
            
            techLines.forEach((line: string, index: number) => {
              checkPageBreak(12);
              pdf.text(line, margin + 60, currentY + (index * 13));
            });
            
            currentY += techLines.length * 13 + 4;
            pdf.setTextColor(0, 0, 0); // Reset color
            break;
        }
      };

      // Technical Script Section - Traditional Cinematographic Format
      if (script.generatedScript.technicalScript) {
        addSectionHeader('GUIÓN TÉCNICO CINEMATOGRÁFICO', 16);
        
        // Add explanatory note
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.text('Formato tradicional de guión cinematográfico profesional', margin, currentY);
        currentY += 20;
        
        // Parse technical script content with basic cleaning
        let technicalContent = script.generatedScript.technicalScript;
        
        // Basic cleaning only
        technicalContent = technicalContent.replace(/%P%/g, '');
        technicalContent = technicalContent.replace(/%[A-Z]%/g, '');
        technicalContent = technicalContent.replace(/\s+/g, ' ').trim();
        
        // Split content into scenes
        const sceneBlocks = technicalContent.split(/(?=ESCENA\s+\d+)/g).filter(block => block.trim());
        
        // If no scene blocks found, try to process the entire content as one block
        if (sceneBlocks.length === 0) {
          // Process entire content as single scene
          checkPageBreak(40);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text('1', margin, currentY);
          currentY += 6;
          
          // Process the entire technical content
          const lines = technicalContent.split('\n').filter(line => line.trim());
          
          let currentElement = '';
          let elementContent = '';
          let shotCounter = 1;
          
          lines.forEach(line => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.includes('SLUGLINE:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, '1');
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'SLUGLINE';
              elementContent = trimmedLine.replace('SLUGLINE:', '').trim();
            } else if (trimmedLine.includes('TIMING:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, '1');
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'TIMING';
              elementContent = trimmedLine.replace('TIMING:', '').trim();
            } else if (trimmedLine.includes('DESCRIPCIÓN DE ACCIÓN:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, '1');
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'DESCRIPCIÓN';
              elementContent = trimmedLine.replace('DESCRIPCIÓN DE ACCIÓN:', '').trim();
            } else if (trimmedLine.includes('DIÁLOGO/NARRACIÓN:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, '1');
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'DIÁLOGO';
              elementContent = trimmedLine.replace('DIÁLOGO/NARRACIÓN:', '').trim();
            } else if (trimmedLine.includes('ACOTACIONES TÉCNICAS:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, '1');
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'ACOTACIONES';
              elementContent = trimmedLine.replace('ACOTACIONES TÉCNICAS:', '').trim();
            } else if (trimmedLine) {
              if (elementContent) {
                elementContent += ' ' + trimmedLine;
              } else {
                elementContent = trimmedLine;
              }
            }
          });
          
          // Add final element
          if (currentElement && elementContent) {
            addTraditionalElement(currentElement, elementContent, shotCounter, '1');
          }
        }
        
        sceneBlocks.forEach((sceneBlock, sceneIndex) => {
          if (!sceneBlock.trim()) return;
          
          checkPageBreak(40);
          
          const sceneMatch = sceneBlock.match(/ESCENA\s+(\d+)/);
          const sceneNumber = sceneMatch ? sceneMatch[1] : (sceneIndex + 1).toString();
          
          // Scene number (left margin, bold)
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(sceneNumber, margin, currentY);
          currentY += 6;
          
          // Process scene content line by line in traditional format
          const lines = sceneBlock.split('\n').filter(line => line.trim() && !line.match(/^ESCENA\s+\d+/));
          
          let currentElement = '';
          let elementContent = '';
          let shotCounter = 1;
          
          lines.forEach(line => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.includes('SLUGLINE:')) {
              // Finish previous element
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, sceneNumber);
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'SLUGLINE';
              elementContent = trimmedLine.replace('SLUGLINE:', '').trim();
            } else if (trimmedLine.includes('TIMING:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, sceneNumber);
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'TIMING';
              elementContent = trimmedLine.replace('TIMING:', '').trim();
            } else if (trimmedLine.includes('DESCRIPCIÓN DE ACCIÓN:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, sceneNumber);
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'DESCRIPCIÓN';
              elementContent = trimmedLine.replace('DESCRIPCIÓN DE ACCIÓN:', '').trim();
            } else if (trimmedLine.includes('DIÁLOGO/NARRACIÓN:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, sceneNumber);
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'DIÁLOGO';
              elementContent = trimmedLine.replace('DIÁLOGO/NARRACIÓN:', '').trim();
            } else if (trimmedLine.includes('ACOTACIONES TÉCNICAS:')) {
              if (currentElement && elementContent) {
                addTraditionalElement(currentElement, elementContent, shotCounter, sceneNumber);
                if (currentElement === 'ACOTACIONES') shotCounter++;
              }
              currentElement = 'ACOTACIONES';
              elementContent = trimmedLine.replace('ACOTACIONES TÉCNICAS:', '').trim();
            } else if (trimmedLine) {
              if (elementContent) {
                elementContent += ' ' + trimmedLine;
              } else {
                elementContent = trimmedLine;
              }
            }
          });
          
          // Add final element
          if (currentElement && elementContent) {
            addTraditionalElement(currentElement, elementContent, shotCounter, sceneNumber);
          }
          
          currentY += 8; // Space between scenes
        });
      }

      // Production Details Section
      addSectionHeader('DETALLES DE PRODUCCIÓN', 14);
      
      const productionData = [];
      if (script.generatedScript.toneOfVoice) productionData.push({ label: 'Tono de Voz:', value: script.generatedScript.toneOfVoice });
      if (script.generatedScript.framework) productionData.push({ label: 'Framework:', value: script.generatedScript.framework });
      if (script.generatedScript.emotions?.length) {
        productionData.push({ label: 'Emociones:', value: script.generatedScript.emotions.join(', ') });
      }

      productionData.forEach(({ label, value }) => {
        checkPageBreak(15);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(label, margin, currentY);
        
        pdf.setFont('helvetica', 'normal');
        const valueLines = pdf.splitTextToSize(value, maxWidth - 40);
        valueLines.forEach((line: string, index: number) => {
          pdf.text(line, margin + 40, currentY + (index * 6));
        });
        currentY += Math.max(valueLines.length * 6, 12) + 3;
      });

      // Visual Suggestions
      if (script.generatedScript.visualSuggestions?.length) {
        addSectionHeader('SUGERENCIAS VISUALES', 14);
        
        script.generatedScript.visualSuggestions.forEach((suggestion, index) => {
          checkPageBreak(15);
          addWrappedText(`${index + 1}. ${suggestion}`, 10);
        });
      }

      // Viral Hashtags
      if (script.generatedScript.viralHashtags?.length) {
        addSectionHeader('HASHTAGS VIRALES RECOMENDADOS', 14);
        const hashtagText = script.generatedScript.viralHashtags.join('  ');
        addWrappedText(hashtagText, 11, 'bold');
      }
    }

    // Add page numbers and footer to all pages
    const totalPages = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Page number
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 30, pageHeight - 15);
      
      // Footer with generation info
      pdf.text(`Generado por KimScript - ${new Date().toLocaleDateString('es-ES')}`, margin, pageHeight - 15);
    }

    // Download the PDF
    const sanitizedTitle = (script.scriptTitle || 'script-viral').replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `${sanitizedTitle}-${Date.now()}.pdf`;
    pdf.save(fileName);

    toast({
      title: "PDF Descargado",
      description: "El script viral se ha descargado exitosamente en formato PDF profesional.",
    });
  };

  const deleteScript = (scriptId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este script?")) {
      deleteScriptMutation.mutate(scriptId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Hace un momento";
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES');
  };

  const getFrameworkIcon = (framework?: string) => {
    const icons: Record<string, string> = {
      'AIDA': '🎯',
      'PAS': '⚡',
      'Hook-Story-CTA': '📖',
      'Antes/Después': '🔄',
      'Problema/Solución': '💡',
      'Storytelling': '🎭'
    };
    return icons[framework || ''] || '📝';
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <File className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Historial de Scripts</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-20 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const scriptsArray = Array.isArray(scripts) ? scripts : [];

  // All available frameworks and platforms from the interface
  const allFrameworks = [
    "Hook-Story-CTA",
    "AIDA",
    "PAS", 
    "Antes/Después",
    "Problema/Solución",
    "Storytelling"
  ];

  const allPlatforms = [
    "TikTok",
    "YouTube",
    "Instagram",
    "Facebook",
    "Twitter",
    "LinkedIn"
  ];

  // Get frameworks and platforms that have actual data
  const usedFrameworks = Array.from(new Set(scriptsArray.map((s: Script) => s.framework).filter((f): f is string => Boolean(f))));
  const usedPlatforms = Array.from(new Set(scriptsArray.map((s: Script) => s.platform).filter((p): p is string => Boolean(p))));

  // Filter and search functionality
  let filteredAndSortedScripts = scriptsArray;

  // Filter by search term
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredAndSortedScripts = filteredAndSortedScripts.filter((script: Script) => {
      return (
        script.scriptTitle?.toLowerCase().includes(searchLower) ||
        script.brandInfo?.toLowerCase().includes(searchLower) ||
        script.businessType?.toLowerCase().includes(searchLower) ||
        script.contentType?.toLowerCase().includes(searchLower) ||
        script.keyMessage?.toLowerCase().includes(searchLower) ||
        script.transcription?.toLowerCase().includes(searchLower)
      );
    });
  }

  // Filter by framework
  if (filterFramework && filterFramework !== "all") {
    filteredAndSortedScripts = filteredAndSortedScripts.filter((script: Script) => script.framework === filterFramework);
  }

  // Filter by platform
  if (filterPlatform && filterPlatform !== "all") {
    filteredAndSortedScripts = filteredAndSortedScripts.filter((script: Script) => script.platform === filterPlatform);
  }

  // Sort scripts
  filteredAndSortedScripts = filteredAndSortedScripts.sort((a: Script, b: Script) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "title":
        return (a.scriptTitle || "").localeCompare(b.scriptTitle || "");
      case "framework":
        return (a.framework || "").localeCompare(b.framework || "");
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterFramework("all");
    setFilterPlatform("all");
    setSortBy("newest");
  };

  // If a script is selected for editing, show the edit interface
  if (selectedScript) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Edit Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Edit className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Editando Script
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Continúa trabajando en tu script "{selectedScript.scriptTitle || 'Sin título'}"
            </p>
            <Button
              onClick={() => setSelectedScript(null)}
              variant="outline"
              className="mt-4"
            >
              <X className="h-4 w-4 mr-2" />
              Volver al Historial
            </Button>
          </div>

          {/* Edit Interface */}
          <div className="max-w-4xl mx-auto">
            <ScriptEditInterface 
              script={selectedScript}
              onScriptUpdated={(updatedScript) => {
                queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
                setSelectedScript(updatedScript);
                toast({
                  title: "Script actualizado",
                  description: "Los cambios se han guardado correctamente.",
                });
              }}
              onCancel={() => setSelectedScript(null)}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <File className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Historial de Scripts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestiona todos tus scripts generados. Visualiza, descarga o elimina según tus necesidades.
          </p>
        </div>

        {/* Search and Filter Bar */}
        {scriptsArray.length > 0 && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                
                {/* Search Input */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por título, marca, tipo de negocio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Framework Filter */}
                <Select value={filterFramework} onValueChange={setFilterFramework}>
                  <SelectTrigger className="w-full lg:w-48 h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los frameworks</SelectItem>
                    {allFrameworks.map((framework) => (
                      <SelectItem key={framework} value={framework}>
                        <span className={usedFrameworks.includes(framework) ? "font-medium" : "text-gray-500"}>
                          {framework}
                          {usedFrameworks.includes(framework) && <span className="ml-2 text-xs text-purple-600">●</span>}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Platform Filter */}
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="w-full lg:w-48 h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400">
                    <Play className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las plataformas</SelectItem>
                    {allPlatforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        <span className={usedPlatforms.includes(platform) ? "font-medium" : "text-gray-500"}>
                          {platform}
                          {usedPlatforms.includes(platform) && <span className="ml-2 text-xs text-purple-600">●</span>}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort Options */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48 h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Más recientes</SelectItem>
                    <SelectItem value="oldest">Más antiguos</SelectItem>
                    <SelectItem value="title">Por título</SelectItem>
                    <SelectItem value="framework">Por framework</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {(searchTerm || filterFramework !== "all" || filterPlatform !== "all" || sortBy !== "newest") && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="h-12 px-4 border-gray-200 hover:border-gray-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Results Summary */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Mostrando {filteredAndSortedScripts.length} de {scriptsArray.length} scripts
                </span>
                {(searchTerm || filterFramework || filterPlatform) && (
                  <span className="text-purple-600 font-medium">
                    Filtros activos
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {scriptsArray.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <File className="h-16 w-16 text-purple-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No hay scripts aún</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Comienza analizando un video viral para generar tu primer script personalizado.
            </p>
            <Button 
              onClick={() => document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg"
            >
              <Brain className="h-5 w-5 mr-2" />
              Analizar Primer Video
            </Button>
          </div>
        ) : (
          /* Scripts List */
          <div className="space-y-6">
            {filteredAndSortedScripts.map((script: Script, index: number) => (
              <Card key={script.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                <div className="flex">
                  
                  {/* Left: Script Number */}
                  <div className="w-20 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold">#{filteredAndSortedScripts.length - index}</div>
                      <div className="text-xs text-purple-200">Script</div>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      
                      {/* Script Info */}
                      <div className="flex-1 pr-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {script.scriptTitle || `Script ${script.framework || 'Generado'}`}
                          </h3>
                          {script.framework && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                              {getFrameworkIcon(script.framework)} {script.framework}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 text-lg leading-relaxed">
                          {script.generatedScript?.hook || script.keyMessage || script.transcription?.slice(0, 120) + "..."}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(script.createdAt)}
                          </div>
                          {script.videoDuration && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {script.videoDuration}s
                            </div>
                          )}
                          {script.businessType && (
                            <Badge variant="outline" className="text-xs">
                              {script.businessType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        
                        {/* Quick Actions */}
                        <div className="hidden md:flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedScript(script)}
                            className="border-green-200 text-green-600 hover:bg-green-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">
                                      {script.scriptTitle || "Script Generado"}
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-600 mt-2">
                                      Creado el {formatDate(script.createdAt)}
                                    </DialogDescription>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {script.framework && (
                                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                        {script.framework}
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="border-blue-200 text-blue-600">
                                      {script.platform}
                                    </Badge>
                                  </div>
                                </div>
                              </DialogHeader>
                              <div className="space-y-6 py-4">
                                {script.generatedScript ? (
                                  <>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-200 shadow-sm">
                                      <h4 className="font-bold text-purple-900 mb-4 flex items-center text-lg">
                                        <div className="bg-purple-200 p-2 rounded-lg mr-3">
                                          <Sparkles className="h-5 w-5 text-purple-700" />
                                        </div>
                                        HOOK - Captura la Atención
                                      </h4>
                                      <p className="text-gray-800 text-lg leading-relaxed font-medium">{script.generatedScript.hook}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 shadow-sm">
                                      <h4 className="font-bold text-blue-900 mb-4 flex items-center text-lg">
                                        <div className="bg-blue-200 p-2 rounded-lg mr-3">
                                          <File className="h-5 w-5 text-blue-700" />
                                        </div>
                                        CUERPO - Desarrolla el Mensaje
                                      </h4>
                                      <p className="text-gray-800 text-lg leading-relaxed font-medium">{script.generatedScript.body}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200 shadow-sm">
                                      <h4 className="font-bold text-green-900 mb-4 flex items-center text-lg">
                                        <div className="bg-green-200 p-2 rounded-lg mr-3">
                                          <Play className="h-5 w-5 text-green-700" />
                                        </div>
                                        LLAMADA A LA ACCIÓN - Convierte
                                      </h4>
                                      <p className="text-gray-800 text-lg leading-relaxed font-medium">{script.generatedScript.cta}</p>
                                    </div>
                                    
                                    {/* Technical Script */}
                                    {script.generatedScript.technicalScript && (
                                      <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                        <h4 className="font-bold text-orange-900 mb-3 flex items-center">
                                          <Zap className="h-5 w-5 mr-2" />
                                          GUÍA TÉCNICA DE PRODUCCIÓN
                                        </h4>
                                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{script.generatedScript.technicalScript}</p>
                                      </div>
                                    )}
                                    
                                    {/* Visual Suggestions */}
                                    {script.generatedScript.visualSuggestions && script.generatedScript.visualSuggestions.length > 0 && (
                                      <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                                        <h4 className="font-bold text-pink-900 mb-3 flex items-center">
                                          <Eye className="h-5 w-5 mr-2" />
                                          SUGERENCIAS VISUALES
                                        </h4>
                                        <ul className="text-gray-700 text-lg leading-relaxed space-y-2">
                                          {script.generatedScript.visualSuggestions.map((suggestion, index) => (
                                            <li key={index} className="flex items-start">
                                              <span className="font-semibold text-pink-700 mr-2">{index + 1}.</span>
                                              {suggestion}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {/* Viral Hashtags */}
                                    {script.generatedScript.viralHashtags && script.generatedScript.viralHashtags.length > 0 && (
                                      <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                                        <h4 className="font-bold text-emerald-900 mb-3 flex items-center">
                                          <Hash className="h-5 w-5 mr-2" />
                                          HASHTAGS VIRALES
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {script.generatedScript.viralHashtags.map((hashtag, index) => (
                                            <Badge key={index} className="bg-emerald-100 text-emerald-800 border-emerald-200 text-sm px-3 py-1">
                                              {hashtag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Additional Details */}
                                    {(script.generatedScript.toneOfVoice || script.generatedScript.framework || script.generatedScript.emotions) && (
                                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h4 className="font-bold text-gray-900 mb-3">DETALLES ADICIONALES</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                          {script.generatedScript.toneOfVoice && (
                                            <div>
                                              <span className="font-semibold text-gray-700">Tono de Voz:</span>
                                              <p className="text-gray-600">{script.generatedScript.toneOfVoice}</p>
                                            </div>
                                          )}
                                          {script.generatedScript.framework && (
                                            <div>
                                              <span className="font-semibold text-gray-700">Framework:</span>
                                              <p className="text-gray-600">{script.generatedScript.framework}</p>
                                            </div>
                                          )}
                                          {script.generatedScript.emotions && script.generatedScript.emotions.length > 0 && (
                                            <div className="md:col-span-2">
                                              <span className="font-semibold text-gray-700">Emociones:</span>
                                              <p className="text-gray-600">{script.generatedScript.emotions.join(', ')}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-3">TRANSCRIPCIÓN</h4>
                                    <p className="text-gray-700 text-lg leading-relaxed">{script.transcription}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyScript(script)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadScriptPDF(script)}
                            className="border-green-200 text-green-600 hover:bg-green-50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                        
                        {/* Mobile Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="md:hidden">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onSelect={() => setSelectedScript(script)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar y Continuar
                            </DropdownMenuItem>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>{script.scriptTitle || "Script Generado"}</DialogTitle>
                                  <DialogDescription>
                                    Creado el {formatDate(script.createdAt)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {script.generatedScript ? (
                                    <>
                                      <div className="bg-purple-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-purple-900 mb-2">HOOK</h4>
                                        <p className="text-gray-700">{script.generatedScript.hook}</p>
                                      </div>
                                      <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-2">CUERPO</h4>
                                        <p className="text-gray-700">{script.generatedScript.body}</p>
                                      </div>
                                      <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-green-900 mb-2">LLAMADA A LA ACCIÓN</h4>
                                        <p className="text-gray-700">{script.generatedScript.cta}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-gray-900 mb-2">TRANSCRIPCIÓN</h4>
                                      <p className="text-gray-700">{script.transcription}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuItem onClick={() => copyScript(script)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadScriptPDF(script)}>
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteScript(script.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Delete Button (Desktop) */}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteScript(script.id)}
                          className="hidden md:flex border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}