import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Video, 
  Share2, 
  Download, 
  Target,
  Brain,
  Zap,
  Calendar,
  Award,
  ChevronUp,
  ChevronDown
} from "lucide-react";

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B'];

interface AnalyticsOverview {
  totalScripts: number;
  avgPerformanceScore: number;
  totalExports: number;
  totalShares: number;
  platformBreakdown: Record<string, number>;
  frameworkUsage: Record<string, number>;
}

interface PerformanceTrend {
  date: string;
  avgScore: number;
  totalScripts: number;
}

interface UserBehavior {
  totalSessions?: number;
  avgSessionDuration?: number;
  bestPerformanceScore?: number;
  favoriteFramework?: string;
  mostUsedPlatform?: string;
  favoriteBusinessType?: string;
  highPerformingScripts?: number;
}

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Fetch analytics overview
  const { data: overview, isLoading: overviewLoading } = useQuery<AnalyticsOverview>({
    queryKey: ['/api/analytics/overview'],
    retry: false,
  });

  // Fetch performance trends
  const { data: trends, isLoading: trendsLoading } = useQuery<PerformanceTrend[]>({
    queryKey: ['/api/analytics/trends', selectedPeriod],
    retry: false,
  });

  // Fetch user behavior analytics
  const { data: behavior, isLoading: behaviorLoading } = useQuery<UserBehavior>({
    queryKey: ['/api/analytics/behavior'],
    retry: false,
  });

  if (overviewLoading || trendsLoading || behaviorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  const formatPlatformData = (platformBreakdown: Record<string, number> = {}) => {
    return Object.entries(platformBreakdown).map(([platform, count]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      value: count,
    }));
  };

  const formatFrameworkData = (frameworkUsage: Record<string, number> = {}) => {
    return Object.entries(frameworkUsage).map(([framework, count]) => ({
      name: framework,
      value: count,
    }));
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Métricas y estadísticas de rendimiento</p>
        </div>
        <div className="flex gap-2">
          {['7', '30', '90'].map((days) => (
            <Button
              key={days}
              variant={selectedPeriod === days ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(days)}
              className={selectedPeriod === days 
                ? "bg-violet-600 text-white" 
                : "text-violet-600 border-violet-200 hover:bg-violet-50"
              }
            >
              {days} días
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-600">Total Análisis</p>
                <p className="text-3xl font-bold text-violet-900">{overview?.totalScripts || 0}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% vs mes anterior</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-violet-600 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Score Promedio</p>
                <p className="text-3xl font-bold text-blue-900">
                  {overview?.avgPerformanceScore ? Math.round(overview.avgPerformanceScore) : 0}%
                </p>
                <div className="flex items-center mt-2">
                  <ChevronUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5.2% mejora</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Exportaciones</p>
                <p className="text-3xl font-bold text-green-900">{overview?.totalExports || 0}</p>
                <div className="flex items-center mt-2">
                  <Download className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">Total acumulado</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Compartidos</p>
                <p className="text-3xl font-bold text-orange-900">{overview?.totalShares || 0}</p>
                <div className="flex items-center mt-2">
                  <Share2 className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-gray-600">Enlaces generados</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="platforms">Plataformas</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="behavior">Comportamiento</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-violet-600" />
                Tendencias de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                      formatter={(value: any, name: string) => [
                        name === 'avgScore' ? `${Math.round(value)}%` : value,
                        name === 'avgScore' ? 'Score Promedio' : 'Total Scripts'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="avgScore" 
                      stroke="#8B5CF6" 
                      fill="url(#colorScore)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2 text-blue-600" />
                  Distribución por Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatPlatformData(overview?.platformBreakdown)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {formatPlatformData(overview?.platformBreakdown).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas por Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formatPlatformData(overview?.platformBreakdown).map((platform, index) => (
                    <div key={platform.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{platform.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{platform.value}</span>
                        <p className="text-sm text-gray-600">análisis</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-violet-600" />
                Uso de Frameworks Neurológicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatFrameworkData(overview?.frameworkUsage)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Patrones de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Total de Sesiones</span>
                    <span className="text-xl font-bold text-green-600">{behavior?.totalSessions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Duración Promedio</span>
                    <span className="text-xl font-bold text-blue-600">
                      {behavior?.avgSessionDuration ? Math.round(behavior.avgSessionDuration / 60) : 0}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-violet-50 rounded-lg">
                    <span className="font-medium">Mejor Score</span>
                    <span className="text-xl font-bold text-violet-600">
                      {behavior?.bestPerformanceScore ? Math.round(behavior.bestPerformanceScore) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Preferencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Framework Favorito</span>
                    <Badge variant="outline" className="bg-violet-50 text-violet-700">
                      {behavior?.favoriteFramework || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Plataforma Preferida</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {behavior?.mostUsedPlatform || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tipo de Negocio</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {behavior?.favoriteBusinessType || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Scripts de Alto Rendimiento</span>
                    <span className="font-bold text-yellow-600">{behavior?.highPerformingScripts || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}