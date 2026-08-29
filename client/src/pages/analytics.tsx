import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Eye, Clock, Target, Zap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Analytics() {
  const { user } = useAuth();

  // Datos de ejemplo para el dashboard
  const stats = {
    totalScripts: 24,
    totalViews: 12500,
    avgEngagement: 8.7,
    viralPotential: 85
  };

  const recentActivity = [
    { id: 1, title: "Script TikTok - Tutorial Cocina", platform: "TikTok", score: 92, date: "2024-01-15" },
    { id: 2, title: "Script Instagram - Producto Nuevo", platform: "Instagram", score: 88, date: "2024-01-14" },
    { id: 3, title: "Script YouTube - Review Tech", platform: "YouTube", score: 95, date: "2024-01-13" }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-violet-600" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Análisis de rendimiento y métricas de tus scripts
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="text-violet-600 border-violet-200 hover:bg-violet-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scripts Generados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalScripts}</p>
                  <p className="text-xs text-green-600 mt-1">+12% este mes</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vistas Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+8% este mes</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgEngagement}%</p>
                  <p className="text-xs text-green-600 mt-1">+2.3% este mes</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Potencial Viral</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.viralPotential}%</p>
                  <p className="text-xs text-green-600 mt-1">+5% este mes</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <Clock className="h-5 w-5 mr-2 text-violet-600" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-violet-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-500">
                          {activity.platform} • {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {activity.score}% viral
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <Users className="h-5 w-5 mr-2 text-violet-600" />
                Resumen de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Scripts de Alto Rendimiento</span>
                  <span className="text-sm font-bold text-gray-900">18 de 24</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Tasa de Conversión</span>
                  <span className="text-sm font-bold text-gray-900">12.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12.5%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Engagement Promedio</span>
                  <span className="text-sm font-bold text-gray-900">8.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}