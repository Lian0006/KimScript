import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
// CACHE BUST - Force complete refresh v2.0.1
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  Target, 
  Zap, 
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Star,
  Share2,
  MessageSquare,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
  File
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getQueryFn } from "@/lib/queryClient";

interface AnalyticsData {
  totalScripts: number;
  totalAnalyses: number;
  avgPerformanceScore: number;
  viralPotential: number;
  engagementRate: number;
  completionRate: number;
  platformDistribution: {
    tiktok: number;
    instagram: number;
    youtube: number;
  };
  frameworkUsage: {
    AIDA: number;
    PAS: number;
    HookStoryCTA: number;
    BeforeAfter: number;
    ProblemSolution: number;
    Storytelling: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'analysis' | 'script' | 'export' | 'share';
    title: string;
    platform: string;
    timestamp: Date;
    performance: number;
  }>;
  performanceTrends: Array<{
    date: string;
    scripts: number;
    performance: number;
    viral: number;
  }>;
  topPerformingScripts: Array<{
    id: number;
    title: string;
    platform: string;
    performance: number;
    viral: number;
    views: number;
    engagement: number;
  }>;
}

export default function AdvancedAnalyticsDashboard() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch analytics data
  const { data: analyticsData, isLoading, error, refetch } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics', timeRange],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando analytics avanzados...</p>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar analytics</h3>
          <p className="text-gray-500 mb-4">No se pudieron cargar los datos analíticos</p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Analytics Avanzados
              </h1>
              <p className="text-gray-600 text-lg">Métricas en tiempo real y insights profundos</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="90d">Últimos 90 días</option>
                  <option value="1y">Último año</option>
                </select>
              </div>
              <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scripts Generados</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.totalScripts}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12% vs mes anterior</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <File className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score Promedio</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.avgPerformanceScore}%</p>
                  <div className="mt-2">
                    <Progress value={analyticsData.avgPerformanceScore} className="h-2" />
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Potencial Viral</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.viralPotential}%</p>
                  <div className="flex items-center mt-2">
                    <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-yellow-600">Alto potencial</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.engagementRate}%</p>
                  <div className="flex items-center mt-2">
                    <Heart className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">+8% vs promedio</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="platforms">Plataformas</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-violet-600" />
                    Distribución por Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-pink-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">TikTok</span>
                      </div>
                      <span className="text-sm font-bold">{analyticsData.platformDistribution.tiktok}%</span>
                    </div>
                    <Progress value={analyticsData.platformDistribution.tiktok} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">Instagram</span>
                      </div>
                      <span className="text-sm font-bold">{analyticsData.platformDistribution.instagram}%</span>
                    </div>
                    <Progress value={analyticsData.platformDistribution.instagram} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">YouTube</span>
                      </div>
                      <span className="text-sm font-bold">{analyticsData.platformDistribution.youtube}%</span>
                    </div>
                    <Progress value={analyticsData.platformDistribution.youtube} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Framework Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Uso de Frameworks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.frameworkUsage).map(([framework, usage]) => (
                      <div key={framework} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{framework}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={usage} className="h-2 w-24" />
                          <span className="text-sm font-bold w-12 text-right">{usage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          activity.type === 'analysis' ? 'bg-violet-100' :
                          activity.type === 'script' ? 'bg-blue-100' :
                          activity.type === 'export' ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          {activity.type === 'analysis' ? <Eye className="h-5 w-5 text-violet-600" /> :
                           activity.type === 'script' ? <File className="h-5 w-5 text-blue-600" /> :
                           activity.type === 'export' ? <Download className="h-5 w-5 text-green-600" /> :
                           <Share2 className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-500">
                            {activity.platform} • {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {activity.performance}% score
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Scripts */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-600" />
                    Scripts de Mejor Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topPerformingScripts.map((script, index) => (
                      <div key={script.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{script.title}</h4>
                            <p className="text-sm text-gray-500">{script.platform}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-600">Performance</p>
                            <p className="text-lg font-bold text-green-600">{script.performance}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-600">Viral</p>
                            <p className="text-lg font-bold text-yellow-600">{script.viral}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-600">Views</p>
                            <p className="text-lg font-bold text-blue-600">{script.views.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(analyticsData.platformDistribution).map(([platform, percentage]) => (
                <Card key={platform}>
                  <CardHeader>
                    <CardTitle className="capitalize">{platform}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{percentage}%</div>
                      <Progress value={percentage} className="h-3 mb-4" />
                      <p className="text-sm text-gray-600">
                        {platform === 'tiktok' && 'Plataforma principal para contenido viral'}
                        {platform === 'instagram' && 'Ideal para marcas y productos'}
                        {platform === 'youtube' && 'Perfecto para contenido educativo'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Tendencias de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performanceTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-600">{trend.date}</div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Scripts</p>
                            <p className="text-sm font-bold">{trend.scripts}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Performance</p>
                            <p className="text-sm font-bold text-green-600">{trend.performance}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Viral</p>
                            <p className="text-sm font-bold text-yellow-600">{trend.viral}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
