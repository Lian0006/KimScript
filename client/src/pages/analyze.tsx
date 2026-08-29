import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { getPlanById } from "@shared/plans";
import DashboardLayout from "@/components/dashboard-layout";
import AnalysisForm from "@/components/analysis-form";
import AnalysisResults from "@/components/analysis-results";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, Brain, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function AnalyzePage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { subscriptionPlan } = useUserProfile();
  const { data: scripts = [] } = useQuery({
    queryKey: ["/api/scripts"],
    enabled: isAuthenticated,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const scriptsArray = Array.isArray(scripts) ? scripts : [];
  const freePlan = getPlanById("free");
  const freePlanExhausted = subscriptionPlan === "free" && freePlan !== undefined && scriptsArray.length >= freePlan.credits;
  const [currentAnalysisResult, setCurrentAnalysisResult] = useState<any>(null);
  const [showAnalysisForm, setShowAnalysisForm] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso no autorizado</h1>
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión para acceder a esta página</p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-violet-600 to-blue-600">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Video className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Analizar Video</h1>
              <p className="text-gray-600 text-lg">Extrae patrones virales y genera scripts optimizados</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 border-0 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Video className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. URL del Video</h3>
            <p className="text-gray-600 text-sm">
              Introduce la URL de un video viral de YouTube, TikTok o Instagram
            </p>
          </Card>
          
          <Card className="text-center p-6 border-0 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">2. Configuración</h3>
            <p className="text-gray-600 text-sm">
              Personaliza el framework neurológico y audiencia objetivo
            </p>
          </Card>
          
          <Card className="text-center p-6 border-0 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3. Script Viral</h3>
            <p className="text-gray-600 text-sm">
              Obtén un script optimizado listo para usar en tus redes
            </p>
          </Card>
        </div>

        {/* Analysis Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center">
              <Video className="h-6 w-6 mr-3" />
              Análisis de Video Viral
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {showAnalysisForm && !currentAnalysisResult ? (
              <AnalysisForm 
                isBlocked={freePlanExhausted}
                onAnalysisComplete={(result) => {
                  setCurrentAnalysisResult(result);
                  setShowAnalysisForm(false);
                }}
              />
            ) : currentAnalysisResult ? (
              <AnalysisResults 
                result={currentAnalysisResult}
                isBlocked={freePlanExhausted}
                onNewAnalysis={() => {
                  setCurrentAnalysisResult(null);
                  setShowAnalysisForm(true);
                }}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
