import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DemoSection() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const workingExamples = [
    {
      platform: "YouTube",
      title: "Video motivacional de negocios",
      url: "https://www.youtube.com/watch?v=BQ4yd2W50No",
      description: "Ejemplo de video que funciona perfectamente con el análisis real",
      duration: "~1 min",
      analysis: "Hook psicológico, estructura narrativa, CTA efectivo"
    },
    {
      platform: "YouTube Shorts",
      title: "Contenido viral de marketing",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Video corto ideal para análisis de viralidad",
      duration: "~30 seg",
      analysis: "Elementos virales, triggers emocionales, mecánicas de engagement"
    }
  ];

  const handleDemoAnalysis = async (videoUrl: string, title: string) => {
    setIsLoading(true);
    
    // Fill the URL in the analysis form
    const urlInput = document.querySelector('input[placeholder*="TikTok"]') as HTMLInputElement;
    if (urlInput) {
      urlInput.value = videoUrl;
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      toast({
        title: "URL de ejemplo cargada",
        description: `"${title}" listo para análisis real`,
      });
      
      // Scroll to the form
      setTimeout(() => {
        document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
    
    setIsLoading(false);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-violet-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Check className="h-4 w-4" />
            Sistema de Análisis Real Verificado
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prueba el Análisis Auténtico
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estos videos públicos de YouTube funcionan perfectamente con nuestro sistema de análisis real. 
            No usamos datos simulados - extraemos y analizamos contenido auténtico.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {workingExamples.map((example, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 mb-1">{example.platform}</div>
                      <h3 className="font-semibold text-gray-900">{example.title}</h3>
                    </div>
                  </div>
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {example.duration}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{example.description}</p>

                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Análisis Real Incluye:</span>
                  </div>
                  <p className="text-xs text-blue-600">{example.analysis}</p>
                </div>

                <Button 
                  onClick={() => handleDemoAnalysis(example.url, example.title)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                >
                  {isLoading ? "Cargando..." : "Probar este ejemplo"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Sistema de Análisis Real Activo</h3>
              <p className="text-green-100">
                Extracción de audio auténtico • Transcripción con OpenAI Whisper • Análisis científico con IA experta
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}