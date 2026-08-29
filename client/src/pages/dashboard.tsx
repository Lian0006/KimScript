import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/dashboard-layout";
import DashboardPlanBanner from "@/components/dashboard-plan-banner";
import AnalysisForm from "@/components/analysis-form";
import AnalysisResults from "@/components/analysis-results";
import ScriptHistory from "@/components/script-history";
import DemoSection from "@/components/demo-section";
import RecentAnalysesPanel from "@/components/user-progress-panel";
import { 
  Brain, 
  Video, 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  BarChart3,
  File, Users,
  Play,
  ArrowRight,
  Star,
  Activity,
  Hash,
  Settings,
  Search,
  FileText,
  BarChart,
  Lightbulb,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Eye,
  Timer,
  Check,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPlanById } from "@shared/plans";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { subscriptionPlan, isLoading: profileLoading } = useUserProfile();
  const { t } = useLanguage();
  const [animatedStats, setAnimatedStats] = useState(false);
  const [currentAnalysisResult, setCurrentAnalysisResult] = useState<any>(null);
  const [showAnalysisForm, setShowAnalysisForm] = useState(true);
  const [activeTab, setActiveTab] = useState("results");

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const { data: scripts = [], isLoading: scriptsLoading, error: scriptsError } = useQuery({
    queryKey: ['/api/scripts'],
    enabled: isAuthenticated,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  // Mostrar dashboard en cuanto haya auth; no bloquear por perfil ni scripts (cargan en segundo plano)
  const waitingForAuth = isLoading || !isAuthenticated;
  const showLoading = waitingForAuth;

  if (showLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const scriptsArray = Array.isArray(scripts) ? scripts : [];
  const freePlan = getPlanById("free");
  const freePlanExhausted = subscriptionPlan === "free" && freePlan !== undefined && scriptsArray.length >= freePlan.credits;
  const stats = {
    videosAnalyzados: scriptsArray.length,
    guionesGenerados: scriptsArray.filter((s: any) => s.generatedScript).length,
    frameworksUsados: new Set(scriptsArray.map((s: any) => s.framework).filter(Boolean)).size,
    promedioViral: scriptsArray.length > 0 ? Math.round(Math.random() * 100) : 0
  };
  // Estimación de minutos IA usados (cada análisis ~1 min aprox.)
  const estimatedMinutesUsed = scriptsArray.length;

  // Prepare recent analyses data for the sidebar
  const recentAnalyses = scriptsArray.slice(0, 5).map((script: any, index: number) => ({
    id: script.id || index + 1,
    title: `Análisis #${script.id || index + 1}`,
    score: script.analysis?.effectiveness_score || Math.round(6 + Math.random() * 4),
    date: script.createdAt ? new Date(script.createdAt).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Hace unas horas',
    framework: script.framework || 'AIDA',
    thumbnail: script.thumbnail
  }));


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Professional Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  ¡Hola, {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'Usuario'}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  Centro de control profesional para análisis de video y generación de contenido viral
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="px-3 py-1">
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                  IA Activa
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Timer className="w-4 h-4 mr-1 text-blue-500" />
                  Tiempo Real
                </Badge>
              </div>
            </div>
          </div>

          {/* Plan banner – uso y upgrade */}
          <div className="mb-8">
            <DashboardPlanBanner
              scriptsCount={scriptsArray.length}
              estimatedMinutesUsed={estimatedMinutesUsed}
            />
          </div>

          {/* Professional Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className={`transition-all duration-700 ${animatedStats ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'} bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Videos Analizados</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.videosAnalyzados}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+12% este mes</span>
                    </div>
                  </div>
                  <div className="h-14 w-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Video className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-700 delay-100 ${animatedStats ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'} bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Scripts Generados</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.guionesGenerados}</p>
                    <div className="flex items-center mt-2">
                      <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-yellow-600">IA Powered</span>
                    </div>
                  </div>
                  <div className="h-14 w-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-700 delay-200 ${animatedStats ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'} bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">Frameworks Usados</p>
                    <p className="text-3xl font-bold text-indigo-900">{stats.frameworksUsados}</p>
                    <div className="flex items-center mt-2">
                      <Brain className="h-4 w-4 text-indigo-500 mr-1" />
                      <span className="text-sm text-indigo-600">Neurociencia</span>
                    </div>
                  </div>
                  <div className="h-14 w-14 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-700 delay-300 ${animatedStats ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'} bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Score Viral</p>
                    <p className="text-3xl font-bold text-emerald-900">{stats.promedioViral}%</p>
                    <div className="flex items-center mt-2">
                      <Target className="h-4 w-4 text-emerald-500 mr-1" />
                      <span className="text-sm text-emerald-600">Excelente</span>
                    </div>
                  </div>
                  <div className="h-14 w-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Professional Tabs Interface */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl p-1">
                  <TabsTrigger value="results" className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    <FileText className="h-4 w-4" />
                    <span>Resultados</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
                    <BarChart className="h-4 w-4" />
                    <span>Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center space-x-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                    <Clock className="h-4 w-4" />
                    <span>Historial</span>
                  </TabsTrigger>
                </TabsList>


            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6">
              {currentAnalysisResult ? (
                <AnalysisResults 
                  result={currentAnalysisResult}
                  isBlocked={freePlanExhausted}
                  onNewAnalysis={() => {
                    setCurrentAnalysisResult(null);
                    setShowAnalysisForm(true);
                    setActiveTab("analyze");
                  }}
                />
              ) : (
                <Card className="shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
                  <CardContent className="p-12 text-center">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay análisis disponibles</h3>
                    <p className="text-gray-600 mb-6">Analiza un video primero para ver los resultados aquí.</p>
                        <Button
                          onClick={() => setActiveTab("results")}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Resultados
                        </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <CardTitle className="flex items-center">
                      <BarChart className="h-6 w-6 mr-3" />
                      Métricas de Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Tasa de Éxito</span>
                        <span className="text-2xl font-bold text-blue-600">87%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Tiempo Promedio</span>
                        <span className="text-2xl font-bold text-green-600">2.3 min</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Mejor Framework</span>
                        <span className="text-2xl font-bold text-purple-600">AIDA</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-6 w-6 mr-3" />
                      Insights de Viralidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Potencial Viral</span>
                        <span className="text-2xl font-bold text-orange-600">8.7/10</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">CTR Estimado</span>
                        <span className="text-2xl font-bold text-red-600">4.2%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Retención 6s</span>
                        <span className="text-2xl font-bold text-yellow-600">73%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <ScriptHistory />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Recent Analyses Panel */}
            <div className="lg:col-span-1">
              <RecentAnalysesPanel 
                recentAnalyses={recentAnalyses}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

