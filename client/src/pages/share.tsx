import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Download, 
  ExternalLink, 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Target
} from "lucide-react";


export default function SharePage() {
  const [match, params] = useRoute("/share/:data");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (params?.data) {
      try {
        // Handle both new and legacy encoding formats
        let decodedData;
        try {
          // Try new format first (with URI encoding)
          decodedData = decodeURIComponent(atob(params.data));
        } catch {
          // Fallback to legacy format
          decodedData = atob(params.data);
        }
        
        const parsedData = JSON.parse(decodedData);
        setAnalysisData(parsedData);
      } catch (err) {
        console.error("Error decoding share data:", err);
        setError("No se pudo cargar el análisis compartido. El enlace puede estar dañado o ser inválido.");
      }
    }
  }, [params]);

  if (!match) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold mb-2">Enlace no válido</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.href = "/"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando análisis compartido...</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Simple toast notification
      const toast = document.createElement('div');
      toast.textContent = 'Enlace copiado al portapapeles';
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Análisis Compartido - KimScript</h1>
              <p className="text-violet-100">Análisis profesional de contenido viral</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copiar enlace
              </Button>
              <Button
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ir a KimScript
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Info */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3" />
                  Información del Video
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">URL:</span>
                    <p className="text-blue-600 break-all">{analysisData.videoUrl}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Plataforma:</span>
                    <Badge className="ml-2 bg-blue-100 text-blue-700">{analysisData.platform}</Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Transcripción:</span>
                    <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-800">{analysisData.transcription}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hook Analysis */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <CardTitle className="flex items-center">
                  <Target className="h-6 w-6 mr-3" />
                  Análisis del Hook
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                    <h4 className="font-medium text-violet-700 mb-2">Hook Identificado</h4>
                    <p className="text-gray-800">{analysisData.analysis.hook}</p>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                    <h4 className="font-medium text-violet-700 mb-2">Tipo</h4>
                    <p className="text-gray-800">{analysisData.analysis.hookType}</p>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                    <h4 className="font-medium text-violet-700 mb-2">Efectividad</h4>
                    <p className="font-semibold text-green-600">{analysisData.analysis.effectiveness}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Viral Elements */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="flex items-center">
                  <Sparkles className="h-6 w-6 mr-3" />
                  Elementos Virales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-3">Elementos Identificados</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.analysis.viralElements?.map((element: string, index: number) => (
                        <Badge key={index} className="bg-blue-100 text-blue-700 px-3 py-1">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {analysisData.analysis.viralMechanics && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Mecánicas Virales</h4>
                      <p className="text-gray-800 bg-blue-50 p-4 rounded-lg">
                        {analysisData.analysis.viralMechanics}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generated Script */}
            {analysisData.generatedScript && (
              <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <CardTitle>Guión Generado</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Hook</h4>
                      <p className="bg-green-50 p-4 rounded-lg">{analysisData.generatedScript.hook}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Cuerpo</h4>
                      <p className="bg-green-50 p-4 rounded-lg">{analysisData.generatedScript.body}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Call to Action</h4>
                      <p className="bg-green-50 p-4 rounded-lg">{analysisData.generatedScript.cta}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button 
                  onClick={() => window.location.href = "/"}
                  className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Crear mi propio análisis
                </Button>
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir este análisis
                </Button>
              </CardContent>
            </Card>

            {/* About KimScript */}
            <Card className="shadow-xl border-0 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">Sobre KimScript</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Plataforma de análisis de videos virales que utiliza inteligencia artificial para identificar elementos clave del éxito en redes sociales y generar scripts personalizados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}