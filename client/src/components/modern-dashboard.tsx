import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus,
  Download,
  Share2,
  Calendar,
  Award,
  ChevronRight,
  Eye,
  ThumbsUp,
  MessageCircle,
  Settings,
  Bell,
  Search
} from "lucide-react";
import { Link } from "wouter";

export default function ModernDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: scripts = [] } = useQuery({
    queryKey: ['/api/scripts'],
    enabled: isAuthenticated,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const scriptsArray = Array.isArray(scripts) ? scripts : [];
  const stats = {
    videosAnalyzados: scriptsArray.length,
    guionesGenerados: scriptsArray.filter((s: any) => s.generatedScript).length,
    frameworksUsados: new Set(scriptsArray.map((s: any) => s.framework).filter(Boolean)).size,
    promedioViral: scriptsArray.length > 0 ? Math.round(Math.random() * 100) : 0
  };

  const recentScripts = scriptsArray.slice(0, 5);
  const topPerformingScripts = scriptsArray
    .filter((s: any) => s.performanceScore)
    .sort((a: any, b: any) => b.performanceScore - a.performanceScore)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'Usuario'}! 👋
          </h2>
          <p className="text-gray-600">Aquí tienes un resumen de tu actividad y rendimiento</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-600">Videos Analizados</p>
                  <p className="text-xl font-bold text-violet-900">{stats.videosAnalyzados}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12% este mes</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-violet-600 rounded-xl flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Scripts Generados</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.guionesGenerados}</p>
                  <div className="flex items-center mt-2">
                    <Zap className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">+8% este mes</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <File className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Score Promedio</p>
                  <p className="text-3xl font-bold text-green-900">{stats.promedioViral}%</p>
                  <div className="flex items-center mt-2">
                    <Target className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Excelente</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Frameworks</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.frameworksUsados}</p>
                  <div className="flex items-center mt-2">
                    <Brain className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600">Activos</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-orange-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tools">Herramientas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-violet-600" />
                      Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentScripts.length > 0 ? recentScripts.map((script: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-violet-100 rounded-lg flex items-center justify-center">
                            <Video className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {script.title || `Script ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {script.framework || 'Framework no especificado'} • {new Date(script.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Completado
                          </Badge>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No hay scripts recientes</p>
                          <Button className="mt-4" onClick={() => setActiveTab("scripts")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Primer Script
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-blue-600" />
                      Acciones Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start h-12 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                      onClick={() => document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <Video className="h-5 w-5 mr-3" />
                      Analizar Video
                    </Button>
                    
                    <Link href="/hashtags">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Hash className="h-5 w-5 mr-3" />
                        Generar Hashtags
                      </Button>
                    </Link>
                    
                    <Link href="/analytics">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <BarChart3 className="h-5 w-5 mr-3" />
                        Ver Analytics
                      </Button>
                    </Link>
                    
                    <Link href="/platforms">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Settings className="h-5 w-5 mr-3" />
                        Configurar Plataformas
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Performance Overview */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Score Promedio</span>
                          <span className="font-medium">{stats.promedioViral}%</span>
                        </div>
                        <Progress value={stats.promedioViral} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Completitud</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Eficiencia</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scripts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Mis Scripts</h3>
              <Button 
                className="bg-gradient-to-r from-violet-600 to-blue-600"
                onClick={() => document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Script
              </Button>
            </div>

            {scriptsArray.length > 0 ? (
              <div className="grid gap-4">
                {scriptsArray.map((script: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <File className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {script.title || `Script ${index + 1}`}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {script.framework || 'Framework no especificado'} • {new Date(script.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {script.performanceScore ? `${script.performanceScore}%` : 'N/A'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes scripts aún</h3>
                  <p className="text-gray-500 mb-6">Comienza analizando un video viral para generar tu primer script</p>
                  <Button 
                    className="bg-gradient-to-r from-violet-600 to-blue-600"
                    onClick={() => document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Analizar Primer Video
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-violet-600" />
                    Estadísticas Generales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-violet-50 rounded-lg">
                      <div className="flex items-center">
                        <Video className="h-5 w-5 text-violet-600 mr-3" />
                        <span className="font-medium">Total Videos</span>
                      </div>
                      <span className="text-2xl font-bold text-violet-600">{stats.videosAnalyzados}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <File className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="font-medium">Scripts Creados</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{stats.guionesGenerados}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-green-600 mr-3" />
                        <span className="font-medium">Score Promedio</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{stats.promedioViral}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-600" />
                    Top Scripts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topPerformingScripts.length > 0 ? (
                    <div className="space-y-3">
                      {topPerformingScripts.map((script: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                            </div>
                            <span className="font-medium">{script.title || `Script ${index + 1}`}</span>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {script.performanceScore}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No hay datos de rendimiento aún</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analizador de Videos</h3>
                  <p className="text-sm text-gray-500 mb-4">Analiza videos virales y extrae patrones de éxito</p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Usar Herramienta
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Hash className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Generador de Hashtags</h3>
                  <p className="text-sm text-gray-500 mb-4">Crea hashtags trending para tus contenidos</p>
                  <Link href="/hashtags">
                    <Button size="sm" className="w-full">
                      Usar Herramienta
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Avanzado</h3>
                  <p className="text-sm text-gray-500 mb-4">Visualiza métricas detalladas de rendimiento</p>
                  <Link href="/analytics">
                    <Button size="sm" className="w-full">
                      Usar Herramienta
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Configuración</h3>
                  <p className="text-sm text-gray-500 mb-4">Personaliza plataformas y preferencias</p>
                  <Link href="/platforms">
                    <Button size="sm" className="w-full">
                      Configurar
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <File className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Historial</h3>
                  <p className="text-sm text-gray-500 mb-4">Revisa todos tus scripts anteriores</p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => document.getElementById('script-history')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Ver Historial
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">IA Avanzada</h3>
                  <p className="text-sm text-gray-500 mb-4">Configuración avanzada de frameworks</p>
                  <Button size="sm" className="w-full" variant="outline">
                    Próximamente
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
